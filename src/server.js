const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Data paths
const jobsFilePath = path.join(__dirname, '..', 'data', 'jobs.json');
const applicationsFilePath = path.join(__dirname, '..', 'data', 'applications.json');
const messagesFilePath = path.join(__dirname, '..', 'data', 'messages.json');

function readJsonFile(filePath) {
	try {
		if (!fs.existsSync(filePath)) {
			return [];
		}
		const raw = fs.readFileSync(filePath, 'utf-8');
		return raw ? JSON.parse(raw) : [];
	} catch (err) {
		console.error('Error reading JSON file:', filePath, err);
		return [];
	}
}

function writeJsonFile(filePath, data) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function normalizeEmail(email) {
	return String(email || '').trim().toLowerCase();
}

// API endpoints scaffolding
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.get('/api/jobs', (req, res) => {
	const jobs = readJsonFile(jobsFilePath);
	res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
	const jobs = readJsonFile(jobsFilePath);
	const job = jobs.find(j => String(j.id) === String(req.params.id));
	if (!job) return res.status(404).json({ error: 'Job not found' });
	res.json(job);
});

app.post('/api/applications', (req, res) => {
	const { jobId, fullName, email, phone, cvUrl, message } = req.body;
	if (!jobId || !fullName || !email) {
		return res.status(400).json({ error: 'jobId, fullName, and email are required' });
	}
	const jobs = readJsonFile(jobsFilePath);
	const job = jobs.find(j => String(j.id) === String(jobId));
	if (!job) return res.status(400).json({ error: 'Invalid jobId' });

	const applications = readJsonFile(applicationsFilePath);
	const newApplication = {
		id: applications.length ? applications[applications.length - 1].id + 1 : 1,
		createdAt: new Date().toISOString(),
		jobId,
		fullName,
		email,
		phone: phone || '',
		cvUrl: cvUrl || '',
		message: message || ''
	};
	applications.push(newApplication);
	writeJsonFile(applicationsFilePath, applications);
	res.status(201).json({ success: true, application: newApplication });
});

// Messages API
app.get('/api/messages', (req, res) => {
	const jobId = req.query.jobId;
	const jobseekerEmail = normalizeEmail(req.query.jobseekerEmail);
	if (!jobId || !jobseekerEmail) {
		return res.status(400).json({ error: 'jobId and jobseekerEmail are required' });
	}
	const messages = readJsonFile(messagesFilePath)
		.filter(m => String(m.jobId) === String(jobId) && normalizeEmail(m.jobseekerEmail) === jobseekerEmail)
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
	res.json(messages);
});

app.post('/api/messages', (req, res) => {
	const { jobId, jobseekerEmail, senderType, senderName, text } = req.body;
	if (!jobId || !jobseekerEmail || !senderType || !text) {
		return res.status(400).json({ error: 'jobId, jobseekerEmail, senderType, and text are required' });
	}
	if (!['jobseeker', 'employer'].includes(senderType)) {
		return res.status(400).json({ error: 'senderType must be jobseeker or employer' });
	}
	const messages = readJsonFile(messagesFilePath);
	const newMessage = {
		id: messages.length ? messages[messages.length - 1].id + 1 : 1,
		createdAt: new Date().toISOString(),
		jobId,
		jobseekerEmail: normalizeEmail(jobseekerEmail),
		senderType,
		senderName: senderName || '',
		text: String(text)
	};
	messages.push(newMessage);
	writeJsonFile(messagesFilePath, messages);
	res.status(201).json({ success: true, message: newMessage });
});

// Fallback to index.html for SPA routes (exclude API routes)
app.get(/^(?!\/api\/).*/, (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server listening on http://0.0.0.0:${PORT}`);
});