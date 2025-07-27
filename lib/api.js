// Helper functions to interact with the Express API
export async function registerUser(data) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchPosts(token) {
  const res = await fetch('/api/posts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function createPost(token, data) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePost(token, id, data) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePost(token, id) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Fetch a single post by ID (requires authentication)
export async function getPost(token, id) {
  const res = await fetch(`/api/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Fetch admin statistics (user and post counts). Requires admin authentication.
export async function fetchStats(token) {
  const res = await fetch('/api/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- About API -----

export async function fetchAbout() {
  const res = await fetch('/api/about');
  return res.json();
}

export async function updateAbout(token, data) {
  const res = await fetch('/api/about', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ----- Skills API -----

export async function fetchSkillsList() {
  const res = await fetch('/api/skills');
  return res.json();
}

export async function createSkill(token, data) {
  const res = await fetch('/api/skills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSkill(token, id, data) {
  const res = await fetch(`/api/skills/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSkill(token, id) {
  const res = await fetch(`/api/skills/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Projects API -----

export async function fetchProjectsList() {
  const res = await fetch('/api/projects');
  return res.json();
}

export async function createProject(token, data) {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProject(token, id, data) {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProject(token, id) {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Contacts API -----

export async function createContact(data) {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchContactMessages(token) {
  const res = await fetch('/api/contacts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function deleteContactMessage(token, id) {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- AI API -----

// Generate AI post content. Requires authentication.
export async function generateAiPost(token) {
  const res = await fetch('/api/ai/generate', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Users API -----

// Fetch list of all users (admin only)
export async function fetchUsersList(token) {
  const res = await fetch('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Fetch current authenticated user profile
export async function fetchMe(token) {
  const res = await fetch('/api/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Friend API -----

// Send a friend request to another user
export async function sendFriendRequest(token, userId) {
  const res = await fetch(`/api/friends/request/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Accept a friend request from a user
export async function acceptFriendRequest(token, userId) {
  const res = await fetch(`/api/friends/accept/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Get pending friend requests for current user
export async function fetchPendingRequests(token) {
  const res = await fetch('/api/friends/pending', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Get accepted friends list
export async function fetchFriends(token) {
  const res = await fetch('/api/friends', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Messaging API -----

// Send a message to another user
export async function sendMessage(token, userId, content) {
  const res = await fetch(`/api/messages/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

// Fetch conversation messages with another user
export async function fetchMessages(token, userId) {
  const res = await fetch(`/api/messages/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Reactions API -----

// Add or update a reaction on a post
export async function addReaction(token, postId, type) {
  const res = await fetch(`/api/reactions/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

// Remove reaction from a post
export async function removeReaction(token, postId) {
  const res = await fetch(`/api/reactions/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Fetch reactions for a post
export async function fetchReactions(postId) {
  const res = await fetch(`/api/reactions/${postId}`);
  return res.json();
}

// ----- Search API -----

// Search posts by query string
export async function searchPosts(token, query) {
  const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ----- Comments API -----

// Fetch comments for a specific post (public). Returns an array of comments.
export async function fetchComments(postId) {
  const res = await fetch(`/api/comments/${postId}`);
  return res.json();
}

// Create a new comment on a post (authenticated)
export async function createComment(token, postId, content) {
  const res = await fetch(`/api/comments/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

// Delete a comment (authenticated). Only the author or admin can delete.
export async function deleteComment(token, id) {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}