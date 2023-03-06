import styles from "styles/common/card.module.css";
import Image from 'next/image'
import { useRouter } from "next/router";
import Link from "next/link";

interface CardProps {
    children: any
    className?: string
}

const Card: React.FC<CardProps> = (props: CardProps) => {
    return (
        <>
            <div className={`${styles.container} ${props.className}`}>
                {props.children}
            </div>
        </>
    );
};

export default Card;