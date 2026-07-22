import { useState } from "react"
import "./sign.css"

export default function Sign() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="sign-container">
      <form className="sign-box" onSubmit={handleSubmit}>
        <h2>Registrati</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirm"
          placeholder="Conferma password"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <button type="submit">Crea account</button>

        <p className="login-link">
          Hai già un account? <a href="/">Accedi</a>
        </p>
      </form>
    </div>
  )
}
