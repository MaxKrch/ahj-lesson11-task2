export default class Routes {
  static posts = {
    new: `/posts/latest`,
  };
  static comments = {
    new: `/posts/{post_id}/comments/latest`,
  };
}
