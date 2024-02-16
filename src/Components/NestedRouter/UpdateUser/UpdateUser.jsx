import { Link } from "react-router-dom"
import img1 from "../../../image/backPage.png"
import user from "../../../image/user.png"
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react"
import axios from "axios"
import Joi from "joi"
import { speechContext } from "../../Context/Store.jsx";
import "./UpdateUser.css"
const UpdateUser = () => {
  let { userData } = useContext(speechContext);
  let Navigate = useNavigate();
  const [error, setError] = useState("")
  const [errorList, setErrorList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState({});



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };


  const [user, setUser] = useState({
    firstname: userData?.firstname,
    lastname: userData?.lastname,
    email: localStorage.getItem("Email"),
    birthday: localStorage.getItem("Date"),
    gender: localStorage.getItem("Gender"),
    phone: localStorage.getItem("phone")
  });


  const formData = new FormData();
  formData.append('image', selectedFile);
  formData.append('firstname', user.firstname);
  formData.append('lastname', user.lastname);
  formData.append('email', user.email);
  formData.append('birthday', user.birthday);
  formData.append('phone', user.phone);
  formData.append('gender', user.gender);


  function getUserData(e) {
    let MyUser = { ...user };
    MyUser[e.target.name] = e.target.value;
    setUser(MyUser)
  }

  async function sendUserData() {
    let { data } = await axios.put(`https://speech-sapm.onrender.com/users`, formData, {
      headers: {
        token: `${localStorage.getItem("Token")}`
      }
    });
    if (data.message === "success") {
      console.log("Good")
      localStorage.setItem("imgCover", data.newUpdate.imgCover);
      localStorage.setItem("phone", data.newUpdate.phone);
      localStorage.setItem("Gender", data.newUpdate.gender);
      localStorage.setItem("Email", data.newUpdate.email);
      localStorage.setItem("Date", data.newUpdate.birthday);
      localStorage.setItem("FirstName", data.newUpdate.firstname);
      localStorage.setItem("LastName", data.newUpdate.lastname);
      localStorage.setItem("FullName", data.newUpdate.fullname);
      console.log(data)
      setLoading(false)
      Navigate("/homepage/account")
    } else {
      setLoading(false)
      setError(data.errors.email.message)

    }
  }
  function validateRegisterForm() {
    let schema = Joi.object({
      firstname: Joi.string()
        .min(3)
        .max(30)
      ,
      lastname: Joi.string()
        .min(3)
        .max(30)
      ,
      gender: Joi.string()
        .min(3)
        .max(8)
      ,
      phone: Joi.string().regex(/^(002)?01[0125][0-9]{8}$/),
      birthday: Joi.string(),
      email: Joi.string()
        .email({ tlds: { allow: false } }),

    })
    return schema.validate(user, { abortEarly: false })
  }


  function submitRegister(e) {

    e.preventDefault();
    setLoading(true);

    let validation = validateRegisterForm()
    if (validation.error) {
      setErrorList(validation.error.details);
      setLoading(false)
    }
    else {
      sendUserData();

    }
  }
  return (

    <div className="container register ">
      <div className="row text-center justify-content-center align-items-center">
        <div className="col-md-6 ">

          <div className="d-flex align-items-center gap-5">
            <Link to="/homepage/account"><i className=" fa-solid fa-arrow-left" style={{ color: "var(--text)", fontSize: "1.5em" }}></i></Link>
            {/* <h6 >Update Data</h6> */}
          </div>
          <form onSubmit={submitRegister}>
            <label htmlFor="fileInput" style={{ cursor: "pointer", textAlign: "center" }} >
              <div className="user-photo">
                <i className="fa-solid fa-pen"></i>
                {
                  localStorage.getItem("imgCover") == "https://speech-sapm.onrender.com/null" ? < img src={img1} className='logo-account1 rounded-circle' /> : <img src={localStorage.getItem("imgCover")} className='logo-account1 rounded-circle' />
                }
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            <div className="d-flex mt-3">
              <input type="text" placeholder={`${localStorage.getItem("FirstName")}`} className="firstName" name='firstname' onChange={getUserData} />
              <input type="text" placeholder={`${localStorage.getItem("LastName")}`} className="lastName" name='lastname' onChange={getUserData} />
            </div>
            <div className="text-danger">
              {errorList.map((error, i) => {
                if (error.context.label === "firstname") {
                  return (
                    <p key={i} className="text-danger text-capitalize ms-2">
                      firstname is not allowed to be empty
                    </p>
                  );
                }
              })}
            </div>
            <div className="text-danger">
              {errorList.map((error, i) => {
                if (error.context.label === "lastname") {
                  return (
                    <p key={i} className="text-danger text-capitalize ms-2">
                      lastname is not allowed to be empty
                    </p>
                  );
                }
              })}
            </div>
            <div className="input d-flex gap-2 p-2">
              <input type="date" placeholder={`${localStorage.getItem("Date")}`} className="input-signup" name='birthday' onChange={getUserData} />
              <div className="text-danger">
                {errorList.map((error, i) => {
                  if (error.context.label === "birthday") {
                    return (
                      <p key={i} className="text-danger text-capitalize">
                        birthday is not allowed to be empty
                      </p>
                    );
                  }
                })}
              </div>
              <input type="number" placeholder={`${localStorage.getItem("phone")}`} className="input-signup" name='phone' onChange={getUserData} />
              {errorList.map((error, i) => {
                if (error.context.label === "phone") {
                  return (
                    <p key={i} className="text-danger text-capitalize">
                      Phone Incorrect
                    </p>
                  );
                }
              })}
              <select id="gender" className="input-signup curser-pointer" name='gender' onChange={getUserData}>
                <option value={`${localStorage.getItem("Gender")}`} className="male">{`${localStorage.getItem("Gender")}`}</option>
                <option value="male" className="male">Male</option>
                <option value="female" className="male">Female</option>
              </select>
              <div className="text-danger">
                {errorList.map((error, i) => {
                  if (error.context.label === "gender") {
                    return (
                      <p key={i} className="text-danger text-capitalize">
                        gender is not allowed to be empty
                      </p>
                    );
                  }
                })}
              </div>
              <input type="email" placeholder={`${localStorage.getItem("Email")}`} className="input-signup" name='email' onChange={getUserData} />
              <div className="text-danger">

                {errorList.filter((item) => item.context.key == "email")[0]?.message}
              </div>

            </div>
            <p className="text-center text-danger">
              {error}
            </p>
            <div className="text-center">
              <button type="submit" className=" btn-login btn-signUp">{loading ? <i className='fas fa-spinner fa-spin'></i> : 'Update'}</button>

            </div>
          </form>

        </div>









      </div>

    </div>

  )
}

export default UpdateUser