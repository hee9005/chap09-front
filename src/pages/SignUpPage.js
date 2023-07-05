import { useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../common/Constant";

import { useNavigate } from "react-router-dom";
import NavBar from "../component/NavBar";
function SignUpPage() {
    /*
        회원가입 UI - /flow/signup
    */
    // =======================이벤트 처리 코드===============================
    const [availableFlag, setAvailableFlag] = useState();
    const verifyBtnRef = useRef();
    const formRef = useRef();
    const emailRef = useRef();
    const navigate = useNavigate();
    const passwordRef= useRef();
    const emailChangeHandle = (evt) => {
        if (/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(evt.target.value)) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", REST_SERVER_ADDRESS + "/api/v1/user/available?email=" + emailRef.currentvalue, false);
            xhr.send();
            // window.alert(xhr.status);
            if (xhr.status === 200) {
                verifyBtnRef.current.disabled = false;
                setAvailableFlag(1);
            } else {
                verifyBtnRef.current.disabled = true
                setAvailableFlag(-1);
            }
        } else {
            verifyBtnRef.current.disabled = true
            setAvailableFlag(0);
        }
        // verifyBtnRef.current.disabled = !(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(evt.target.value));
    }
    const verfiyBtnClickHandle = (evt) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/verify-email", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("email=" + formRef.current.email.value);
        window.alert(xhr.status);
        console.log(xhr.responseText);
        setAvailableFlag(2);
    }
    const codeSubmitHandle = (evt) => {
        if (evt.keyCode !== 13)
            return;

        evt.preventDefault();

        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", REST_SERVER_ADDRESS + "/api/v1/user/verify-email", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("email=" + formRef.current.email.value + "&code=" + evt.target.value);

        if (xhr.status === 200) {
            setAvailableFlag(4);
            emailRef.current.readOnly = true;
            verifyBtnRef.current.disabled = true
        }else {
            const response =JSON.parse(xhr.responseText);
            window.alert(response.cause);
        }
    }

    const signupSubmitHandle = (evt) => {
        evt.preventDefault();
        const email = emailRef.current.value;
        const name = formRef.current.name.value;
        const password = passwordRef.current.value;

        if (email === "" || name === "" || password === "" || availableFlag !== 4) {
            window.alert("회원가입에 필요한 절차를 통과하지 못했다.");
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/join", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("email=" + email + "&name=" + name + "&password=" + password);
        window.alert(xhr.status);
        if (xhr.status === 201) {
            navigate("/flow/login");
        } else {

        }

        }
    

    //===================================================================== 
    return (
        <div className="container mt-5 pt-3">
        <NavBar />

        <>
        <h2>계정을 생성하세요</h2>
        <hr/>
        <form ref={formRef} onSubmit={signupSubmitHandle}>
            <p>
                <span>이름</span>
                <input type="text" placeholder="이름" name="name"/>
            </p>
            <p>
                <span>이메일</span>
                <input type="text" placeholder="이메일" onChange={emailChangeHandle} name="email" ref={emailRef} />
                <button type="button" ref={verifyBtnRef} 
                                onClick={verfiyBtnClickHandle}>이메일인증</button>
            </p>
            {availableFlag === 1 && <p>사용가능한 Email 입니다</p>}
            {availableFlag === -1 && <p>이미 사용중 인  Email 입니다</p>}
            {availableFlag === 2 && <p>
                <span>이메일인증번호</span>
                <input type="text" placeholder="인증번호"  onKeyDown={codeSubmitHandle}/>
            </p>}
            
            <p>
                <span>비밀번호</span>
                <input type="password" placeholder="비밀번호" ref={passwordRef}/>
            </p> 
            <p>
                <button type="submit">가입하기</button>
            </p>                      
        </form>
    </>
                                </div>
    );
}

export default SignUpPage;