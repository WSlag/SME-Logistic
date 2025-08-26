async function fetchJobs() {
	const res = await fetch('/api/jobs');
	return res.json();
}

function unique(values) {
	return Array.from(new Set(values)).sort();
}

function renderFilters(jobs) {
	const countrySelect = document.getElementById('country');
	const categorySelect = document.getElementById('category');
	for (const c of unique(jobs.map(j => j.country))) {
		const o = document.createElement('option');
		o.value = c; o.textContent = c; countrySelect.appendChild(o);
	}
	for (const c of unique(jobs.map(j => j.category))) {
		const o = document.createElement('option');
		o.value = c; o.textContent = c; categorySelect.appendChild(o);
	}
}

function matches(job, { q, country, category }) {
	const text = `${job.title} ${job.employer} ${job.city} ${job.country} ${job.category}`.toLowerCase();
	const qOk = !q || text.includes(q.toLowerCase());
	const cOk = !country || job.country === country;
	const catOk = !category || job.category === category;
	return qOk && cOk && catOk;
}

function jobCard(job) {
	const div = document.createElement('div');
	div.className = 'card';
	div.innerHTML = `
		<h3>${job.title}</h3>
		<div class="meta">
			<span class="badge">${job.country}${job.city ? ' · ' + job.city : ''}</span>
			<span class="badge">${job.employer}</span>
			<span class="badge">${job.category}</span>
			<span class="badge">${job.contractType}</span>
		</div>
		<p>${job.description}</p>
		<div class="meta">
			<span>Visa: ${job.visa}</span>
			<span>Salary: ${job.salary}</span>
		</div>
		<div>
			<button data-action="apply" data-jobid="${job.id}">Apply</button>
			<button data-action="chat" data-jobid="${job.id}">Chat</button>
		</div>
	`;
	div.querySelector('button[data-action="apply"]').addEventListener('click', () => openApplyModal(job));
	div.querySelector('button[data-action="chat"]').addEventListener('click', () => openChatModal(job));
	return div;
}

function renderJobs(jobs, filters) {
	const container = document.getElementById('results');
	container.innerHTML = '';
	const filtered = jobs.filter(j => matches(j, filters));
	if (!filtered.length) {
		container.textContent = 'No jobs found. Try adjusting your filters.';
		return;
	}
	for (const job of filtered) container.appendChild(jobCard(job));
}

// ---------------- Application modal ----------------
function openApplyModal(job) {
	const modal = document.getElementById('modal');
	document.getElementById('modalTitle').textContent = `Apply — ${job.title} (${job.country})`;
	document.getElementById('jobId').value = job.id;
	document.getElementById('formStatus').textContent = '';
	modal.classList.remove('hidden');
}

function closeModal() {
	document.getElementById('modal').classList.add('hidden');
}

async function submitApplication(e) {
	e.preventDefault();
	const form = e.target;
	const data = Object.fromEntries(new FormData(form).entries());
	if (!data.fullName || !data.email) {
		return alert('Please fill in your name and email.');
	}
	const res = await fetch('/api/applications', {
		method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
	});
	const json = await res.json();
	const status = document.getElementById('formStatus');
	if (json.success) {
		status.textContent = 'Application submitted! We will contact you soon.';
		form.reset();
	} else {
		status.textContent = json.error || 'Something went wrong.';
	}
}

// ---------------- Chat modal ----------------
let currentChat = { job: null, pollId: null };

function renderMessages(list) {
	const box = document.getElementById('chatMessages');
	box.innerHTML = '';
	for (const m of list) {
		const bubble = document.createElement('div');
		bubble.className = 'bubble ' + (m.senderType === 'jobseeker' ? 'me' : 'them');
		const when = new Date(m.createdAt).toLocaleString();
		bubble.innerHTML = `
			<div>${escapeHtml(m.text)}</div>
			<div class="meta">${m.senderName ? escapeHtml(m.senderName) + ' · ' : ''}${when}</div>
		`;
		box.appendChild(bubble);
	}
	box.scrollTop = box.scrollHeight;
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

async function fetchThread(jobId, jobseekerEmail) {
	const url = `/api/messages?jobId=${encodeURIComponent(jobId)}&jobseekerEmail=${encodeURIComponent(jobseekerEmail)}`;
	const res = await fetch(url);
	return res.json();
}

function startPolling() {
	stopPolling();
	currentChat.pollId = setInterval(async () => {
		if (!currentChat.job) return;
		const email = document.getElementById('chatEmail').value.trim();
		if (!email) return;
		const messages = await fetchThread(currentChat.job.id, email);
		renderMessages(messages);
	}, 3000);
}

function stopPolling() {
	if (currentChat.pollId) {
		clearInterval(currentChat.pollId);
		currentChat.pollId = null;
	}
}

function openChatModal(job) {
	currentChat.job = job;
	document.getElementById('chatTitle').textContent = `Chat — ${job.title} (${job.country})`;
	document.getElementById('chatMessages').innerHTML = '';
	document.getElementById('chatModal').classList.remove('hidden');
	startPolling();
}

function closeChatModal() {
	stopPolling();
	currentChat.job = null;
	document.getElementById('chatModal').classList.add('hidden');
}

async function sendChatMessage(e) {
	e.preventDefault();
	if (!currentChat.job) return;
	const name = document.getElementById('chatName').value.trim();
	const email = document.getElementById('chatEmail').value.trim();
	const text = document.getElementById('chatInput').value.trim();
	if (!email) return alert('Please enter your email to chat.');
	if (!text) return;
	const payload = {
		jobId: currentChat.job.id,
		jobseekerEmail: email,
		senderType: 'jobseeker',
		senderName: name,
		text
	};
	const res = await fetch('/api/messages', {
		method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
	});
	const json = await res.json();
	if (json.success) {
		document.getElementById('chatInput').value = '';
		const messages = await fetchThread(currentChat.job.id, email);
		renderMessages(messages);
	}
}

async function main() {
	const jobs = await fetchJobs();
	renderFilters(jobs);
	const readFilters = () => ({
		q: document.getElementById('q').value,
		country: document.getElementById('country').value,
		category: document.getElementById('category').value
	});
	const apply = () => renderJobs(jobs, readFilters());
	document.getElementById('applyFilters').addEventListener('click', apply);
	apply();
	// Application modal events
	document.getElementById('closeModal').addEventListener('click', closeModal);
	document.getElementById('applyForm').addEventListener('submit', submitApplication);
	// Chat modal events
	document.getElementById('closeChat').addEventListener('click', closeChatModal);
	document.getElementById('chatForm').addEventListener('submit', sendChatMessage);
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeModal();
			closeChatModal();
		}
	});
}

main();