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

// Fallback to index.html for SPA routes (exclude API routes)
app.get(/^(?!\/api\/).*/, (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server listening on http://0.0.0.0:${PORT}`);
});