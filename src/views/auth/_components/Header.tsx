type HeaderProps = {
  setDrawerOpen: (open: boolean) => void;
};

export default function Header({ setDrawerOpen }: HeaderProps) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full flex items-center px-8 py-4 z-10 bg-transparent">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-blue-400 tracking-wide cursor-default select-none">
            VINXIS
          </h1>
          <button
            className="text-lg font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          >
            Sign In
          </button>
        </div>
      </header>
    </>
  );
}
