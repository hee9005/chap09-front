import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtState, userEmailState } from "..";
import { REST_SERVER_ADDRESS } from "../common/Constant";
import NavBar from "../component/NavBar";

function LoginPage() {

    const navigate = useNavigate();
    const formRef = useRef();

    const [jwt,setJwt] =  useRecoilState(jwtState);

    const [userEmail,setUserEmail] = useRecoilState(userEmailState);
  
    window.onmessage = (evt) =>{
        console.log(evt.data.type);
        if(evt.data.type ==="kakaoAuth"){
            setJwt(evt.data.jwtToken);
            setUserEmail(evt.data.userEmail);
            navigate("/")
        }
    }
    const loginFormHandle = (evt) => {  
        evt.preventDefault();
        const email = formRef.current.email.value;
        const password = formRef.current.password.value;
        if(email === "" || password === "") {
             formRef.current.email.focus();
             return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/login", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("email=" + email + "&password=" + password);
        window.alert(xhr.status);
        if (xhr.status === 200) {
            // window.alert(xhr.responseText);
            const response = JSON.parse(xhr.responseText);
            // window.alert(response.token);
            setJwt(response.token);
            sessionStorage.setItem("authToken", response.token);
            sessionStorage.setItem("authUserEmail", response.userEmail);
            navigate("/");
        } else if(xhr.status===400) {
            formRef.current.email.classList.add("is-invalid");
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.value = "";
            formRef.current.email.select();
            formRef.current.email.focus();
        } else {
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.value = "";
        }
    }
    const kakaoLoginHandle = (evt) =>{ 
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/api/v1/oauth/kakao", false);
        xhr.send();
    //    window.alert(xhr.responseText);
        const url = JSON.parse(xhr.responseText).oauthUri;
        window.open(url, "_blank", "width=400, height=620, popup=1");
    }
    return (
        <div className="container mt-5 pt-3">
        <NavBar />
        <h2>#로그인</h2>
        
        <form onSubmit={loginFormHandle} ref={formRef}>
            <div className="mb-3">
                <span className="form-label">사용자이메일(*)</span>
                <input type="text" className="form-control" name="email" />
            </div>
            <div className="mb-3">
                <span className="form-label">사용자비밀번호(*)</span>
                <input type="password" className="form-control" name="password" />
            </div>
            <div className="mb-3">
                <button type="submit" className="form-control">로그인</button>
            </div>
            <div className="mb-3">
                <button type="button" className="form-control" onClick={kakaoLoginHandle}>카카오로 로그인하기</button>
            </div>
        </form>
        <div>
        계정이 없으신가요? <Link to="/flow/signup">회원가입</Link>
        </div>
    </div>
   
    );
}

export default LoginPage;