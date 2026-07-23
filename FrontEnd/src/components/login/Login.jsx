import { useState } from "react"
import "./login.css"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    console.log("Login:", data)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p id="heading">Login</p>

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

      <div className="btn">
        <button className="button1" type="submit">
          Login
        </button>

        <button
          className="button2"
          type="button"
          onClick={() => (window.location.href = "/signup")}
        >
          Sign Up
        </button>
      </div>

      <button className="button3" type="button">
        Forgot Password
      </button>
    </form>
  )
}
