import type { NextPage } from "next";
import Head from 'next/head'
import styles from "styles/login/index.module.css";
import Logo from "assets/common/logo.svg";
import Image from 'next/image'
import TextField from '@mui/material/TextField';
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Login as LoginService, SaveLogin } from "../services/Authentication";

const Login: NextPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [warning, setWarning] = useState<string>("");

  const onSubmit = async () => {
    if (
      username === "" ||
      password === ""
    ) return;
    try {
      const res = await LoginService(username, password);
      SaveLogin(res.accessToken);
      router.push("/")
    } catch (err: any) {
      setWarning("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      console.error(err?.response?.data.message)
    }
  }

  return (
    <>
      <Head>
        <title>CMS | Login</title>
        <link rel="icon" href="/icon.svg" />
      </Head>
      <div className="grid grid-cols-2 min-w-screen min-h-screen h-full w-full">
        <div className={styles.itemLeft}>
          <div className={styles.logo}>
            <Image src={Logo} alt="Logo" width={41} height={56} priority={false} />
          </div>
          <div className={`${styles.formContainer}`}>
            <h1 className={styles.title}>เข้าสู่ระบบ</h1>
            <h2 className={styles.subTitle}>ระบบจัดการข้อมูลการแจ้งซ่อม</h2>
            <div className={styles.formItem}>
              <TextField id="username" label="Username" variant="outlined" fullWidth onChange={(e) => {
                setUsername(e.target.value)
              }} />
            </div>
            <div className={styles.formItem}>
              <TextField id="password" label="รหัสผ่าน" type="password" variant="outlined" fullWidth onChange={(e) => {
                setPassword(e.target.value)
              }} />
            </div>
            <button className={styles.btn} onClick={onSubmit}>เข้าสู่ระบบ</button>
            <Link href={'/forgot-password'}>
            <button className={styles.transBtn} onClick={onSubmit}>ลืมรหัสผ่าน ?</button>
            </Link>
            {warning}
          </div>
          <div className="flex-grow"></div>
          <div className={styles.footer}>by A RAMEN</div>
        </div>
        <div className={styles.itemRight}>
          <div className={`${styles.bg} bg-primary`}>
            {/* <Image src={Bg} alt="Logo" width={604} height={720} priority={false} /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login