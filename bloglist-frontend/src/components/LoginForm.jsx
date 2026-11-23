import { TextField, Button } from '@mui/material'

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => (
  <div>
    <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          variant="standard"
          label='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          variant="standard"
          label='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" type="submit" sx={{ mt:2 }}>
        login
      </Button>
    </form>
  </div>
)

export default LoginForm
