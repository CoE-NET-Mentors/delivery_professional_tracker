export const ApiService = {
  async registerMentor(accessToken) {
    const res = await fetch('/api/mentor/register', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    if (res.ok === true) {
      return await res.json();
    }
  },

  async fetchMentees(accessToken) {
    const res = await fetch('/api/mentor/mentees', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    if (res.ok === true) {
      return await res.json();
    }
  },

  async searchDeliveryProfessionals(accessToken, searchTerm) {
    const res = await fetch('/api/mentor/dpsearch?searchTerm=' + (searchTerm ?? ''), {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    if (res.ok === true) {
      return await res.json();
    }
  },

  async addMenteeToMentor(accessToken, menteeId) {
    const res = await fetch(`/api/mentor/mentees/${menteeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (res.ok === true) {
      return true;
    }
    throw new Error('Failed to add mentee to mentor');
  },

  async deleteMentee(accessToken, menteeId) {
    const res = await fetch(`/api/mentor/mentees/${menteeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (res.ok === true) {
      return true;
    }

    throw new Error('Failed to delete mentee');
  },

  async fetchMenteeRecords(accessToken, menteeId) {
    const res = await fetch(`/api/mentor/mentees/${menteeId}/records`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    if (res.ok === true) {
      return await res.json();
    }
  },

  async addMenteeRecord(accessToken, menteeId, record) {
    const res = await fetch(`/api/mentor/mentees/${menteeId}/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });
    if (res.ok === true) {
      return await res.json();
    }
  },

  async updateMenteeRecord(accessToken, menteeId, recordId, record) {
    const res = await fetch(`/api/mentor/mentees/${menteeId}/records/${recordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });
    if (res.ok === true) {
      return await res.json();
    }
  },

  async deleteMenteeRecord(accessToken, menteeId, recordId) {
    const res = await fetch(`/api/mentor/mentees/${menteeId}/records/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (res.ok === true) {
      return await res.json();
    }
  }
}


