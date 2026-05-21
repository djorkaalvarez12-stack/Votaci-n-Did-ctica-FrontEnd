import React from "react";

interface HeaderProps {
  title: string;
  showMenu?: boolean;
  showBack?: boolean;
  onBackClick?: () => void;
  avatarUrl?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showMenu = false,
  showBack = false,
  onBackClick,
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCe_PWvi_kqoq-OYvi17dEwyP3WtV52d9paHjWbNE62L1SIZWeatrAsJFXdb6T8F3Yng7tC_FWHbvLqimT4sAB0sbnaDyHiC9YntuTHGvmeU6-M4YR8xJtMxWqWJUd7Z70BU7YtmgnOXYLVqal4fO_9QCDA3LlpjRxTr-BdMFnZG-bcWBC76ekpyyueIQT1I1qUPkxCURhFCL-lYrOgUuhLVoxqmhVvy7_1cw4lP3ISf3sWHfCQ39R4Z1iX2qW2r8Xw7YEommR-_WY",
  onLogout,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#ddffe2]/80 dark:bg-[#0b361d]/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBackClick}
              className="material-symbols-outlined text-[#006941] dark:text-[#7bfeb8] hover:bg-[#bef5c9] dark:hover:bg-emerald-800/50 p-2 rounded-full transition-transform active:scale-90"
            >
              arrow_back
            </button>
          )}
          {showMenu && (
            <button className="text-[#006941] dark:text-[#7bfeb8] hover:bg-[#bef5c9] dark:hover:bg-emerald-800/50 p-2 rounded-full transition-transform active:scale-90">
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}
          <h1 className="font-headline font-bold tracking-tight text-xl text-[#0b361d] dark:text-[#caffdc]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="material-symbols-outlined text-[#006941] dark:text-[#7bfeb8] hover:bg-[#bef5c9] dark:hover:bg-emerald-800/50 p-2 rounded-full transition-transform active:scale-90"
            >
              logout
            </button>
          )}

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container shadow-sm">
            <img
              alt="Perfil"
              className="w-full h-full object-cover"
              src={avatarUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
