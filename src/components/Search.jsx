import smallLogo from "../assets/logo-small-white.svg";

export function Search() {
  return (
    <section className="search">
      <img src={smallLogo} alt="small-logo" />
      <span className="search-bar">
        <input type="text" />
        <span class="material-symbols-outlined">search</span>
      </span>
    </section>
  );
}
