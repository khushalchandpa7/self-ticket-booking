import "./LoginCard.css";

export default function LoginForm() {
  return (
    <form className="login-form">
      <input type="email" placeholder="Email"></input>
      <input type="password" placeholder="Password"></input>
      <input type="submit" value="Login"></input>
    </form>
  );
}
