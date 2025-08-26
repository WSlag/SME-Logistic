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
		<button data-jobid="${job.id}">Apply</button>
	`;
	div.querySelector('button').addEventListener('click', () => openModal(job));
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

function openModal(job) {
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
	document.getElementById('closeModal').addEventListener('click', closeModal);
	document.getElementById('applyForm').addEventListener('submit', submitApplication);
	window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

main();