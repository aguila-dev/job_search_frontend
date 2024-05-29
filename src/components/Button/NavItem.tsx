type NavbarLink = {
  name: string;
  path: string;
  active?: boolean;
};
interface NavItemProps {
  link: NavbarLink;
  handleClickLink: (path: string) => void;
}
const NavItem = ({ link, handleClickLink }: NavItemProps) => {
  return (
    <button
      type='button'
      className='hover:cursor-pointer hover:opacity-90 px-4 py-2 text-black w-full active:bg-slate-200 rounded-xl'
      onClick={() => handleClickLink(link.path)}
    >
      {link.name}
    </button>
  );
};

export default NavItem;
