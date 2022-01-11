function toggleForm() {
  $('.container').toggleClass('active')
}

$('#lbtn').click(function (e) {
  e.preventDefault()
  const email = $('#lemail').val()
  const pass = $('#lpass').val()
  $('#lerror').text('')
  var error = false
  if (pass == '' || email == '') {
    $('#lerror').text('please fill all the fields')
    error = true
  }
  if (!ValidateEmail($('#lemail').val())) {
    $('#lerror').text('please enter a valid email address')
    error = true
  }
  if (error == true) {
    error = false
  } else {
    login(email, pass)
  }
})

$('#sbtn').click(function (e) {
  e.preventDefault()
  const name = $('#sname').val()
  const email = $('#semail').val()
  const pass = $('#spass').val()
  const repass = $('#srpass').val()
  $('#serror').text('')
  var error = false
  if (pass != repass) {
    $('#serror').text(`password doesn't match`)
    error = true
  }
  if (!ValidateEmail($('#semail').val())) {
    $('#serror').text('please enter a valid email address')
    error = true
  }

  if (pass == '' || email == '' || name == '') {
    $('#serror').text('please fill all the fields')
    error = true
  }
  if (error == true) {
    error = false
  } else {
    register(name, email, pass)
  }
})

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}

async function login(email, password) {
  await axios
    .post('/api/v1/auth/login', {
      email: email,
      password: password,
    })
    .then((res) => {
      console.log(res)
      const jwt = res.data.token
      const name = res.data.name
      localStorage.setItem('jwt', jwt)
      localStorage.setItem('name', name)
      location.href = '/'
    })
    .catch((err) => {
      if (err.response.data.msg) {
        $('#serror').text(err.response.data.msg)
      }
    })
}

async function register(name, email, password) {
  console.log(JSON.stringify({ name: name, email: email, password: password }))
  await axios
    .post('/api/v1/auth/register', {
      name: name,
      email: email,
      password: password,
    })
    .then((res) => {
      console.log(res)
      const jwt = res.data.token
      const name = res.data.user.name
      localStorage.setItem('jwt', jwt)
      localStorage.setItem('name', name)
      location.href = '/'
    })
    .catch((err) => {
      console.error(err.response.data)
      if (err.response.data.msg) {
        $('#serror').text(err.response.data.msg)
      }
    })
}
