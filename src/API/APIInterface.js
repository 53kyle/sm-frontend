import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //axios.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // 18.216.192.141
    axios.defaults.baseURL = `http://18.216.192.141:8000/`;

    // Allow the browser to send cookies to the API domain (which include auth_token)
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

    async allUsers() {
        return axiosAgent.get(`users/`);
    }

    async user(username) {
        return axiosAgent.get(`users/${username}/`)
    }

    async doesFollow(username, other_username) {
        return axiosAgent.get(`users/${username}/follows/${other_username}`);
    }

    async follows(username) {
        return axiosAgent.get(`users/${username}/follows/`);
    }

    async addFollow(params) {
        return axiosAgent.post(`users/follows/`, params);
    }

    async isFollower(username, other_username) {
        return axiosAgent.get(`users/${username}/followers/${other_username}/`);
    }

    async followers(username) {
        return axiosAgent.get(`users/${username}/followers/`);
    }

    async allPosts() {
        return axiosAgent.get(`posts/`);
    }

    async addPost(params) {
        return axiosAgent.post(`posts/`, params);
    }

    async post(post_id) {
        return axiosAgent.post(`posts/${post_id}/`);
    }

    async postsForUser(username) {
        return axiosAgent.post(`users/${username}/posts/`);
    }

    async commentsOnPost(post_id) {
        return axiosAgent.post(`posts/${post_id}/comments/`);
    }

    async addComment(post_id, params) {
        return axiosAgent.post(`posts/${post_id}/comments/`, params);
    }

    async repliesOnComment(comment_id) {
        return axiosAgent.post(`comments/${comment_id}/replies`);
    }

    async addReply(comment_id, params) {
        return axiosAgent.post(`comments/${comment_id}/replies`, params);
    }

    async postLikes(post_id) {
        return axiosAgent.get(`posts/${post_id}/likes/`);
    }

    async didLikePost(post_id, username) {
        return axiosAgent.get(`posts/${post_id}/likes/${username}/`);
    }

    async addPostLike(post_id, params) {
        return axiosAgent.post(`posts/${post_id}/likes/`, params);
    }

    async commentLikes(comment_id) {
        return axiosAgent.get(`comments/${comment_id}/likes/`);
    }

    async didLikeComment(comment_id, username) {
        return axiosAgent.get(`comments/${comment_id}/likes/${username}/`);
    }

    async addCommentLike(comment_id, params) {
        return axiosAgent.post(`comments/${comment_id}/likes/`, params);
    }

    async replyLikes(reply_id) {
        return axiosAgent.get(`replies/${reply_id}/likes/`);
    }

    async didLikeReply(reply_id, username) {
        return axiosAgent.get(`replies/${reply_id}/likes/${username}/`);
    }

    async addReplyLike(reply_id, params) {
        return axiosAgent.post(`replies/${reply_id}/likes/`, params);
    }

    async postDislikes(post_id) {
        return axiosAgent.get(`posts/${post_id}/dislikes/`);
    }

    async didDislikePost(post_id, username) {
        return axiosAgent.get(`posts/${post_id}/dislikes/${username}/`);
    }

    async addPostDislike(post_id, params) {
        return axiosAgent.post(`posts/${post_id}/dislikes/`, params);
    }

    async commentDislikes(comment_id) {
        return axiosAgent.get(`comments/${comment_id}/dislikes/`);
    }

    async didDislikeComment(comment_id, username) {
        return axiosAgent.get(`comments/${comment_id}/dislikes/${username}/`);
    }

    async addCommentDislike(comment_id, params) {
        return axiosAgent.post(`comments/${comment_id}/dislikes/`, params);
    }

    async replyDislikes(reply_id) {
        return axiosAgent.get(`replies/${reply_id}/dislikes/`);
    }

    async didDislikeReply(reply_id, username) {
        return axiosAgent.get(`replies/${reply_id}/dislikes/${username}/`);
    }

    async addReplyDislike(reply_id, params) {
        return axiosAgent.post(`replies/${reply_id}/dislikes/`, params);
    }

    async searchForUser(search_term) {
        return axiosAgent.get(`search/users/${search_term}/`);
    }

    async searchForPost(search_term) {
        return axiosAgent.get(`search/posts/${search_term}/`);
    }
}