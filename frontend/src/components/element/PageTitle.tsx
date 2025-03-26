type Props = {
  content: string
}

const PageTitle = ({ content }: Props) => {
  return <div className='text-2xl font-bold leading-9'>{content}</div>
}
export default PageTitle
