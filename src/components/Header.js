function Header({ user }) {
  return (
    <div>
      <h1>Bienvenido, {user.displayName}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Header;