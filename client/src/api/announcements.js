import axios from './axios';

export const getAnnouncements = async (token) => {
    const response = await axios.get('/announcements', {
        headers: { token }
    });
    return response.data;
}

export const addAnnouncement = async (token, announcementData) => {
    const response = await axios.post('/announcements', announcementData, {
        headers: { token }
    })
    return response.data;
}

export const editAnnouncement = async (token, id, announcementData) => {
    const response = await axios.put(`/announcements/${id}`, announcementData, {
        headers: { token }
    })
    return response.data;
}

export const deleteAnnouncement = async (token, id) => {
    const response = await axios.delete(`/announcements/${id}`, {
        headers: { token }
    })
    return response.data;
}


