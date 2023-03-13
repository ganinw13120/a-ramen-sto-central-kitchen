import styles from "styles/common/delete-modal.module.css";
import Image from 'next/image'
import Button from "./Buttont";
import BinIcon from "assets/common/bin.svg";

interface ModalProps {
    action : string
    text: string
    onClose?: () => void
    onSubmit?: () => void
    color : string
    fontColor : string
    titleColor : string
    icon:any
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
    window.onclick = function (event) {
        if ((event.target as any).id === "myModal") props.onClose?.();
    }
    return (
        <>
            <div>
                <div id="myModal" className="modal"  >
                    <div className={`modal-content`} style={{ width: '30%', borderRadius: "28px" }}>
                        <div className="mt-3">
                            <Image src={props.icon} alt="icon" className="mx-auto" width={24} height={24} priority={false} />
                        </div>
                        <div className={styles.title} style={{color:`#${props.titleColor}`}}>
                            ยืนยันการ{props.action}
                        </div>
                        <div className={styles.text}>
                            ต้องการ{props.action} <span className={styles.name}>{props.text}</span> ใช่หรือไม่ <br/>
                        </div>
                        <div className={styles.footer}>
                            <div className='flex-grow'>
                            </div>
                            <Button text="ยกเลิก" backgroundColor='white' textColor='#C8C8C8' onClick={() => {
                                props.onClose?.();
                            }} />
                            <Button text="ยืนยัน" backgroundColor={`#${props.color}`} textColor={`#${props.fontColor}`} onClick={() => {
                                props.onSubmit?.();
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;