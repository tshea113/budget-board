import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2">
      <h2 className="scroll-m-20 justify-self-start p-2 text-3xl font-semibold tracking-tight first:mt-0">
        Budget Board
      </h2>
      <div className="justify-self-end p-2">
        <Avatar>
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
