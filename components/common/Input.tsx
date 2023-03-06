import styles from "styles/common/input.module.css";
import Image from 'next/image'
import { useRouter } from "next/router";
import Link from "next/link";

interface InputProps {
    placeHolder ?: string
    onChange ?: (val : string) => void
}

const Input: React.FC<InputProps> = (props: InputProps) => {
    return (
        <>
            <input className={`${styles.container}`} placeholder={props.placeHolder} onChange={(e)=>{props.onChange?.(e.target.value)}}></input>
        </>
    );
};

export default Input;