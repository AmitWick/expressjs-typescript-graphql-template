export const CACHE_KEYS = {
  USER_Prefix: "User",
  USER: function (id: string) {
    return `${this.USER_Prefix}:${id}`;
  },
  POST_Prefix: "Post",
  POST: function (id: string) {
    return `${this.POST_Prefix}:${id}`;
  },
};
