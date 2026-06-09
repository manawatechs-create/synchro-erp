import Image from 'next/image'

interface IconProps {
  name: string
  size?: number
  color?: string
  className?: string
  alt?: string
}

export default function Icon({ name, size = 24, className = '', alt = 'icône' }: IconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ minWidth: size, minHeight: size }}
    />
  )
}
