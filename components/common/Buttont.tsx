import styles from "styles/common/button.module.css";
import Image from 'next/image'

interface ButtonProps {
    backgroundColor ?: string
    textColor ?: string
    text : string
    icon ?: any
    onClick ?: () => void
    className ?: string
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <>
            <div
            onClick={props.onClick}
             className={`${styles.container} ${props.className}`} style={{color : props.textColor, backgroundColor : props.backgroundColor}}>
                {
                    props.icon &&
                    <Image src={props.icon} className={styles.icon} alt="Logo" width={16} height={20} priority={false} />
                }
                <div className="m-auto">
                {props.text}
                </div>
            </div>
        </>
    );
};

export default Button;