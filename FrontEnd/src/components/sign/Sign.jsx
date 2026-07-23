import { useState } from "react"
import "./sign.css"

export default function Sign() {
  const [form, setForm] = useState({
    username: "",
    nome: "",
    cognome: "",
    email: "",
    password: "",
    confirm: "",
    ruolo: "USER",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirm) {
      console.log("Le password non coincidono")
      return
    }

    const res = await fetch("http://localhost:8080/utenti/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        nome: form.nome,
        cognome: form.cognome,
        email: form.email,
        password: form.password,
        ruolo: form.ruolo,
      }),
    })

    const data = await res.json()
    console.log("Registrazione:", data)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p id="heading">Sign Up</p>

      <div className="field">
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="input-field"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <input
          name="nome"
          type="text"
          placeholder="Nome"
          className="input-field"
          value={form.nome}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <input
          name="cognome"
          type="text"
          placeholder="Cognome"
          className="input-field"
          value={form.cognome}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input-field"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input-field"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          className="input-field"
          value={form.confirm}
          onChange={handleChange}
          required
        />
      </div>

      <div className="btn">
        <button className="button1" type="submit">
          Create Account
        </button>

        <button
          className="button2"
          type="button"
          onClick={() => (window.location.href = "/")}
        >
          Login
        </button>
      </div>

      <button className="button3" type="button">
        Forgot Password
      </button>
    </form>
  )
}
