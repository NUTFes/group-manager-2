import { FC } from 'react';
import Link from 'next/link';
import { useMenuHooks } from './hooks';

const Menu: FC = () => {
  const { menuSections } = useMenuHooks();

  return (
    <div className="fixed left-0 z-[1] h-full w-sidebar overflow-auto bg-gradient-to-br from-gray-800/90 to-gray-800/80 pb-5 backdrop-blur-sm">
      <div className="flex w-full flex-col items-start justify-start gap-1.5 pb-[60px]">
        {menuSections.map((section) => (
          <div key={section.title} className="w-full">
            <div className="w-full border-y border-gray-500 p-5 text-base font-light tracking-wide text-white">
              <h4>{section.title}</h4>
            </div>
            <nav className="w-full">
              <ul className="m-0 list-none p-0">
                {section.items.map((item) => (
                  <li
                    key={item.title}
                    className="flex size-full items-center transition-all duration-200 hover:shadow-[4px_4px_5px_#484747,-2px_-2px_8px_#636060] active:shadow-[inset_2px_2px_5px_#484747,inset_-2px_-2px_5px_#686565]"
                  >
                    <Link
                      href={item.click}
                      className="inline-flex size-full items-center truncate px-5 py-4 text-base font-light text-white no-underline transition-all duration-200 hover:translate-x-2 hover:font-medium hover:tracking-wider"
                    >
                      <span className="material-icons mr-2.5 pb-px text-xl font-thin">
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
