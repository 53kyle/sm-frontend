import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX.
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // Indicate to the API that data will be formatted in JSON.
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // Set the baseURL for all requests to the API.
    // IP for EC2: 18.216.192.141
    axios.defaults.baseURL = `http://18.216.192.141:8000/`;

    // Allow the browser to send cookies to the API.
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    axios.defaults.withCredentials = true;

    return axios;
};

const axiosAgent = AxiosConfigured();

export default class APIInterface {
    async registerUser(params) {
        return axiosAgent.post(`register/`, params);
    }

    async login(params) {
        return axiosAgent.post(`login/`, params);
    }

    async logout() {
        return axiosAgent.post(`logout/`);
    }

    async user(username) {
        return axiosAgent.get(`users/${username}/`)
    }

    // If any data is returned by doesFollow, 'username' follows 'other_username'.
    async doesFollow(username, other_username) {
        return axiosAgent.get(`users/${username}/follows/${other_username}`);
    }

    // Returns a list of users that 'username' follows.
    async follows(username) {
        return axiosAgent.get(`users/${username}/follows/`);
    }

    async addFollow(username, params) {
        return axiosAgent.post(`users/${username}/follows/`, params);
    }

    // If any data is returned by isFollower, 'other_username' follows 'username'.
    async isFollower(username, other_username) {
        return axiosAgent.get(`users/${username}/followers/${other_username}/`);
    }

    // Returns a list of users that follow 'username'.
    async followers(username) {
        return axiosAgent.get(`users/${username}/followers/`);
    }

    // Returns the first 10 most recent posts globally.
    async allPosts() {
        return axiosAgent.get(`posts/`);
    }

    // Returns the first 10 posts which took place prior to 'latest_datetime'
    // In practice, 'latest_datetime' is when the last-loaded post was posted.
    async allPostsPastDateTime(latest_datetime) {
        return axiosAgent.get(`posts/after/${latest_datetime}/`);
    }

    // Returns the first 10 most recent posts from users that 'username' follows.
    async followingPosts(username) {
        return axiosAgent.get(`posts/following/${username}/`);
    }

    // Returns the first 10 posts which took place prior to 'latest_datetime', posted by users which 'username' follows.
    // In practice, 'latest_datetime' is when the last-loaded post was posted.
    async followingPostsPastDateTime(username, latest_datetime) {
        return axiosAgent.get(`posts/following/${username}/after/${latest_datetime}/`);
    }

    async addPost(params) {
        return axiosAgent.post(`posts/`, params);
    }

    // Returns a single post corresponding to 'post_id'.
    async post(post_id) {
        return axiosAgent.get(`posts/${post_id}/`);
    }

    // Returns the first 10 most recent replies to a given post, corresponding to 'post_id'.
    async repliesToPost(post_id) {
        return axiosAgent.get(`posts/${post_id}/replies/`);
    }

    // Returns the first 10 replies to a given post, corresponding to 'post_id', which took place prior to 'latest_datetime'.
    // In practice, 'latest_datetime' is when the last-loaded reply was posted.
    async repliesToPostPastDateTime(post_id, latest_datetime) {
        return axiosAgent.get(`posts/${post_id}/replies/after/${latest_datetime}/`);
    }

    // Returns the first 10 most recent posts by 'username'.
    async postsForUser(username) {
        return axiosAgent.get(`users/${username}/posts/`);
    }

    // Returns the first 10 posts by 'username, which took place prior to 'latest_datetime'.
    // In practice, 'latest_datetime' is when the last-loaded reply was posted.
    async postsForUserPastDateTime(username, latest_datetime) {
        return axiosAgent.get(`users/${username}/posts/after/${latest_datetime}/`);
    }

    // Returns the number of likes on a given post, corresponding to 'post_id'.
    async postLikes(post_id) {
        return axiosAgent.get(`posts/${post_id}/likes/`);
    }

    // If any data is returned by didLikePost, 'username' has liked the post corresponding to 'post_id'.
    async didLikePost(post_id, username) {
        return axiosAgent.get(`posts/${post_id}/likes/${username}/`);
    }

    async addPostLike(post_id, params) {
        return axiosAgent.post(`posts/${post_id}/likes/`, params);
    }

    // Returns the number of dislikes on a given post, corresponding to 'post_id'.
    async postDislikes(post_id) {
        return axiosAgent.get(`posts/${post_id}/dislikes/`);
    }

    // If any data is returned by didDislikePost, 'username' has disliked the post corresponding to 'post_id'.
    async didDislikePost(post_id, username) {
        return axiosAgent.get(`posts/${post_id}/dislikes/${username}/`);
    }

    async addPostDislike(post_id, params) {
        return axiosAgent.post(`posts/${post_id}/dislikes/`, params);
    }

    // Returns a list of users containing 'search_term'.
    // Spaces in the search term are omitted because usernames cannot have spaces in them.
    async searchForUser(search_term) {
        return axiosAgent.get(`search/users/${search_term.replace(/\s+/g, '')}/`);
    }

    // Returns a list of posts containing 'search_term'.
    async searchForPost(search_term) {
        return axiosAgent.get(`search/posts/${search_term}/`);
    }
}