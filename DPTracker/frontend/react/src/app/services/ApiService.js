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
    const res = await fetch('/api/mentor/dpsearch?searchTerm=' + searchTerm ?? '', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    if (res.ok == true) {
      return await res.json();
    }
  }
}

