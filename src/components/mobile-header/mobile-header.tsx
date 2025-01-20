import React from 'react'
import styles from './mobile-header.module.scss'
import { BackArrow } from '../svgs/svgs'
interface MobileHeaderProps {
  title: string,
  button?: {
    text: string,
    onClick: () => void
  }
}
const MobileHeader = ({title, button}: MobileHeaderProps) => {
  return (
    <div className={styles.mobileHeader1}>
        <h1>{title}</h1>
      <div onClick={button?.onClick} className={styles.rightDiv}>
        <h2>{button?.text}</h2>
      </div>
    </div>
  )
}

export default MobileHeader
