import styles from "styles/common/navbar.module.css";
import Logo from "assets/common/logo.svg";
import AppName from "assets/common/appname.svg";
import Image from 'next/image'
import { Popover } from 'antd';

import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import { Logout } from "../../services/Authentication";
import { AuthProfile } from "../../models/Authentication";
interface NavBarProps {
    profile: AuthProfile
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
    const router = useRouter();
    return (
        <>
            <div className={`${styles.wrapper} bg-bg`}>
                <div className={`w-full ${styles.container}`}>
                    <Image src={Logo} alt="Logo" width={34} height={25} priority={false} />
                    <div className={styles.separetor}></div>
                    <div className={styles.appname}>STO System</div>
                    <div className={styles.appmodule}>Central Kitchen</div>
                    {/* <Image src={AppName} className={styles.appName} alt="Logo" width={61} height={21} priority={false} /> */}
                    <div className="flex-grow"></div>
                    <Popover placement="bottomRight" content={<>
                        <div className={styles.popupContainer}>
                            {props.profile.name}
                            <button className={styles.btn} onClick={() => {
                                Logout();
                                router.push('/login');
                            }}>ออกจากระบบ</button>
                        </div>
                    </>} trigger="click">
                        <button className={`${styles.name} `}>
                            {props.profile.name}
                        </button>
                    </Popover>
                </div>
            </div>
        </>
    );
};

export default NavBar;