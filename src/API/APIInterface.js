import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //axios.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

    // Set the baseURL for all requests to the API domain instead of the current domain
    axios.defaults.baseURL = `http://18.216.192.141:8000/`;

    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    axios.defaults.withCredentials = true;

    return axios;
};

const axiosAgent = AxiosConfigured();

export default class APIInterface {
    async allUsers() {
        return axiosAgent.get(`user/`);
    }

    async registerUser(params) {
        return axiosAgent.post(`register/`, params);
    }

    async login(params) {
        return axiosAgent.post(`login/`, params);
    }

    async logout() {
        return axiosAgent.post(`logout/`);
    }

    async allFollows() {
        return axiosAgent.get(`follow/`);
    }

    async addFollow(params) {
        return axiosAgent.post(`follow/`, params);
    }

    async allPosts() {
        return axiosAgent.get(`post/`);
    }

    async addPost(params) {
        return axiosAgent.post(`post/`, params);
    }

    async allComments() {
        return axiosAgent.get(`comment/`);
    }

    async addComment(params) {
        return axiosAgent.post(`comment/`, params);
    }

    async allReplies() {
        return axiosAgent.get(`reply/`);
    }

    async addReply(params) {
        return axiosAgent.post(`reply/`, params);
    }

    async allPostLikes() {
        return axiosAgent.get(`post-like/`);
    }

    async addPostLike(params) {
        return axiosAgent.post(`post-like/`, params);
    }

    async allCommentLikes() {
        return axiosAgent.get(`comment-like/`);
    }

    async addCommentLike(params) {
        return axiosAgent.post(`comment-like/`, params);
    }

    async allReplyLikes() {
        return axiosAgent.get(`reply-like/`);
    }

    async addReplyLike(params) {
        return axiosAgent.post(`reply-like/`, params);
    }

    async allPostDislikes() {
        return axiosAgent.get(`post-dislike/`);
    }

    async addPostDislike(params) {
        return axiosAgent.post(`post-dislike/`, params);
    }

    async allCommentDislikes() {
        return axiosAgent.get(`comment-dislike/`);
    }

    async addCommentDislike(params) {
        return axiosAgent.post(`comment-dislike/`, params);
    }

    async allReplyDislikes() {
        return axiosAgent.get(`reply-dislike/`);
    }

    async addReplyDislike(params) {
        return axiosAgent.post(`reply-dislike/`, params);
    }
}