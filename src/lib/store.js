import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Projects
export function getProjects() {
  return readJSON('projects.json');
}

export function getProjectById(id) {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
}

export function addProject(project) {
  const projects = getProjects();
  projects.push({ ...project, createdAt: new Date().toISOString().split('T')[0] });
  writeJSON('projects.json', projects);
  return project;
}

export function updateProject(id, updates) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates };
  writeJSON('projects.json', projects);
  return projects[idx];
}

export function deleteProject(id) {
  let projects = getProjects();
  projects = projects.filter(p => p.id !== id);
  writeJSON('projects.json', projects);
  return true;
}

// Blogs
export function getBlogs() {
  return readJSON('blogs.json');
}

export function getBlogById(id) {
  return getBlogs().find(b => b.id === id) || null;
}

export function addBlog(blog) {
  const blogs = getBlogs();
  blogs.push({ ...blog, date: new Date().toISOString().split('T')[0] });
  writeJSON('blogs.json', blogs);
  return blog;
}

export function updateBlog(id, updates) {
  const blogs = getBlogs();
  const idx = blogs.findIndex(b => b.id === id);
  if (idx === -1) return null;
  blogs[idx] = { ...blogs[idx], ...updates };
  writeJSON('blogs.json', blogs);
  return blogs[idx];
}

export function deleteBlog(id) {
  let blogs = getBlogs();
  blogs = blogs.filter(b => b.id !== id);
  writeJSON('blogs.json', blogs);
  return true;
}

// Activities
export function getActivities() {
  return readJSON('activities.json');
}

export function addActivity(activity) {
  const activities = getActivities();
  activities.unshift({ ...activity, id: `act-${Date.now()}`, date: new Date().toISOString().split('T')[0] });
  writeJSON('activities.json', activities);
  return activity;
}
