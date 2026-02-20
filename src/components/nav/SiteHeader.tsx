import { useEffect, useMemo, useRef, useState } from "react";

type MenuKey = "products" | "solutions" | "learn";
type ExternalLinkKey = "geniusiq" | "customers";

type ProductItem = {
  label: string;
  href: string;
  isNew?: boolean;
};

type ProductGroup = {
  title: string;
  href: string;
  items: ProductItem[];
};

type BasicLink = {
  label: string;
  href: string;
};

type DescriptiveLink = {
  title: string;
  href: string;
  description: string;
};

const NAV_CONFIG = {
  logo: {
    href: "/",
    src: "/genius-assets/genius_logo.svg",
    alt: "Genius Sports",
  },
  topOrder: ["products", "solutions", "geniusiq", "customers", "learn"] as const,
  topLabels: {
    products: "Products",
    solutions: "Solutions",
    geniusiq: "GeniusIQ",
    customers: "Customers",
    learn: "Learn",
  },
  topExternal: {
    geniusiq: "https://www.geniussports.com/geniusiq/",
    customers: "https://www.geniussports.com/built-on-genius/",
  },
  cta: {
    label: "Contact Sales",
    href: "https://www.geniussports.com/contact-sales/",
  },
  solutions: {
    leftColumn: [
      {
        title: "For Sports Leagues",
        href: "https://www.geniussports.com/leagues/",
        description: "Transform the way you capture and use data. For every stakeholder.",
      },
      {
        title: "For Brands",
        href: "https://www.geniussports.com/brands/",
        description: "Reach and engage sports fans efficiently. Beyond generic adtech.",
      },
    ] as DescriptiveLink[],
    rightColumn: [
      {
        title: "For Sportsbooks",
        href: "https://www.geniussports.com/sportsbooks/",
        description: "Be more profitable. Outsource trading, risk and more to the experts.",
      },
      {
        title: "For Content Owners",
        href: "https://www.geniussports.com/content-owners/",
        description: "Transform your broadcast, stream or highlight reel, and reimagine viewing experiences.",
      },
    ] as DescriptiveLink[],
    promo: {
      title: "FIBA U19 World Cup showcases AI innovation with GeniusIQ",
      href: "https://www.geniussports.com/geniusiq/",
      imageSrc: "/solutions-dropdown.png",
    },
  },
  products: {
    groups: [
      {
        title: "Perform",
        href: "https://www.geniussports.com/perform/",
        items: [
          { label: "Performance Analysis", href: "https://www.geniussports.com/perform/" },
          { label: "AI Officiating", href: "https://www.geniussports.com/perform/saot/", isNew: true },
          { label: "League Software", href: "https://www.geniussports.com/leagues/" },
          { label: "Integrity Services", href: "https://www.geniussports.com/bet/" },
        ],
      },
      {
        title: "Engage",
        href: "https://www.geniussports.com/engage/",
        items: [
          { label: "FANHub", href: "https://www.geniussports.com/engage/" },
          { label: "Augmentation", href: "https://www.geniussports.com/content-owners/" },
          { label: "Gamification", href: "https://www.geniussports.com/engage/" },
          { label: "Sports Data API", href: "https://www.geniussports.com/engage/official-sports-data-api/" },
        ],
      },
      {
        title: "Bet",
        href: "https://www.geniussports.com/bet/",
        items: [
          { label: "Data & Odds APIs", href: "https://www.geniussports.com/sportsbooks/" },
          { label: "Genius Trading Services", href: "https://www.geniussports.com/bet/genius-trading-services/" },
          { label: "BetVision", href: "https://www.geniussports.com/bet/bet-vision/" },
        ],
      },
    ] as ProductGroup[],
    promo: {
      title: "Welcome to FANHub",
      body: "The only omni-channel advertising platform custom-built to reach and engage sports fans.",
      imageSrc: "/fanhub-correct.png",
    },
  },
  learn: {
    links: [
      {
        title: "Content Hub",
        href: "https://www.geniussports.com/content-hub/",
        description: "Head to our resources centre for the latest events, blog articles and webinars.",
      },
      {
        title: "Newsroom",
        href: "https://www.geniussports.com/newsroom/",
        description: "From the back page to the front page. See the latest press releases and Genius news.",
      },
    ] as DescriptiveLink[],
    promo: {
      title: "SAOT – Semi-Automated Offside Technology",
      body: "SAOT brings back the joy of the beautiful game to fans with instant, accurate decision making.",
      href: "https://www.geniussports.com/perform/saot/",
    },
  },
} as const;

type SiteHeaderProps = {
  activeExternalLink?: ExternalLinkKey | null;
};

const HEADER_HEIGHT = 96;
const DROPDOWN_OFFSET = 12;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M6 14L14 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 6H14V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function InlineArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CornerLaunchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M4.5 11.5L11.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 4.5H11.5V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SiteHeader({ activeExternalLink = null }: SiteHeaderProps) {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState<MenuKey | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState<MenuKey | null>(null);
  const [detectedActiveExternal, setDetectedActiveExternal] = useState<ExternalLinkKey | null>(null);

  const headerRef = useRef<HTMLElement | null>(null);
  const hoverOpenTimerRef = useRef<number | null>(null);
  const hoverCloseTimerRef = useRef<number | null>(null);
  const triggerRefs = useRef<Record<MenuKey, HTMLButtonElement | null>>({
    products: null,
    solutions: null,
    learn: null,
  });

  const clearTimers = () => {
    if (hoverOpenTimerRef.current !== null) {
      window.clearTimeout(hoverOpenTimerRef.current);
      hoverOpenTimerRef.current = null;
    }
    if (hoverCloseTimerRef.current !== null) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  };

  const closeAllMenus = () => {
    setOpenMenu(null);
    setPinnedMenu(null);
    setIsMobileOpen(false);
    setMobileOpenSection(null);
    clearTimers();
  };

  const openMenuWithIntent = (menu: MenuKey) => {
    if (hoverCloseTimerRef.current !== null) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
    if (hoverOpenTimerRef.current !== null) {
      window.clearTimeout(hoverOpenTimerRef.current);
    }
    hoverOpenTimerRef.current = window.setTimeout(() => {
      setOpenMenu(menu);
      hoverOpenTimerRef.current = null;
    }, 100);
  };

  const closeMenuWithIntent = () => {
    if (pinnedMenu) return;
    if (hoverOpenTimerRef.current !== null) {
      window.clearTimeout(hoverOpenTimerRef.current);
      hoverOpenTimerRef.current = null;
    }
    if (hoverCloseTimerRef.current !== null) {
      window.clearTimeout(hoverCloseTimerRef.current);
    }
    hoverCloseTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null);
      hoverCloseTimerRef.current = null;
    }, 150);
  };

  const handleTriggerClick = (menu: MenuKey) => {
    clearTimers();
    const isSamePinned = pinnedMenu === menu && openMenu === menu;
    if (isSamePinned) {
      setPinnedMenu(null);
      setOpenMenu(null);
      return;
    }
    setPinnedMenu(menu);
    setOpenMenu(menu);
  };

  const activeExternal = useMemo(() => {
    if (activeExternalLink) return activeExternalLink;
    return detectedActiveExternal;
  }, [activeExternalLink, detectedActiveExternal]);

  useEffect(() => {
    const href = window.location.href;
    if (href.startsWith(NAV_CONFIG.topExternal.geniusiq)) {
      setDetectedActiveExternal("geniusiq");
      return;
    }
    if (href.startsWith(NAV_CONFIG.topExternal.customers)) {
      setDetectedActiveExternal("customers");
    }
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenu) {
        const key = openMenu;
        setOpenMenu(null);
        setPinnedMenu(null);
        triggerRefs.current[key]?.focus();
      }
      if (isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [openMenu, isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) {
      setMobileOpenSection(null);
    }
  }, [isMobileOpen]);

  useEffect(
    () => () => {
      clearTimers();
    },
    [],
  );

  const topButtonClass = "relative inline-flex h-full items-center font-heading text-[16px] font-medium text-slate-900";
  const menuTop = HEADER_HEIGHT + DROPDOWN_OFFSET;

  const renderUnderline = (isActive: boolean) => (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-600 transition-all duration-200",
        isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75 group-hover:opacity-100 group-hover:scale-x-100",
      )}
    />
  );

  return (
    <header
      ref={headerRef}
      className="absolute left-0 top-0 z-50 h-[96px] w-full bg-transparent font-sans"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-8 lg:gap-12">
          <a href={NAV_CONFIG.logo.href} aria-label="Genius Sports home" className="inline-flex items-center">
            <img src={NAV_CONFIG.logo.src} alt={NAV_CONFIG.logo.alt} className="h-[66px] w-auto" />
          </a>

          <nav
            className="relative hidden h-full items-center gap-7 lg:flex"
            aria-label="Primary"
            onMouseLeave={closeMenuWithIntent}
          >
            {NAV_CONFIG.topOrder.map((itemKey) => {
              if (itemKey === "geniusiq" || itemKey === "customers") {
                const href = NAV_CONFIG.topExternal[itemKey];
                const isActive = activeExternal === itemKey;
                return (
                  <a key={itemKey} href={href} className={cx(topButtonClass, "group")}>
                    {NAV_CONFIG.topLabels[itemKey]}
                    {renderUnderline(isActive)}
                  </a>
                );
              }

              const menuKey = itemKey as MenuKey;
              const isOpen = openMenu === menuKey;
              return (
                <button
                  key={menuKey}
                  ref={(node) => {
                    triggerRefs.current[menuKey] = node;
                  }}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  aria-controls={`site-header-menu-${menuKey}`}
                  onMouseEnter={() => openMenuWithIntent(menuKey)}
                  onFocus={() => {
                    setOpenMenu(menuKey);
                  }}
                  onClick={() => handleTriggerClick(menuKey)}
                  className={cx(topButtonClass, "group")}
                >
                  {NAV_CONFIG.topLabels[menuKey]}
                  {renderUnderline(isOpen)}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:flex">
          <a
            href={NAV_CONFIG.cta.href}
            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-6 py-2.5 text-[16px] font-medium text-slate-900 transition-colors hover:bg-gray-200"
          >
            {NAV_CONFIG.cta.label}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-900 lg:hidden"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="site-header-mobile-menu"
          onClick={() => {
            setIsMobileOpen((prev) => !prev);
            setOpenMenu(null);
            setPinnedMenu(null);
          }}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      {openMenu && (
        <div
          id={`site-header-menu-${openMenu}`}
          role="menu"
          className="absolute left-0 z-50 hidden w-full border-b border-gray-200 bg-white/95 font-heading backdrop-blur-sm motion-safe:animate-[dropdownFadeSlideIn_220ms_ease-out] lg:block"
          style={{ top: menuTop }}
          onMouseEnter={() => {
            if (hoverCloseTimerRef.current !== null) {
              window.clearTimeout(hoverCloseTimerRef.current);
              hoverCloseTimerRef.current = null;
            }
          }}
          onMouseLeave={closeMenuWithIntent}
        >
          <div className="mx-auto w-full max-w-[1280px] px-6 py-7 lg:px-10">
            {openMenu === "solutions" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-7">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-9">
                    {[NAV_CONFIG.solutions.leftColumn, NAV_CONFIG.solutions.rightColumn].map((column, index) => (
                      <div key={index} className="space-y-7">
                        {column.map((link) => (
                          <a
                            key={link.title}
                            href={link.href}
                            role="menuitem"
                            className="block rounded-lg py-1.5 focus:outline-none"
                          >
                            <h3 className="font-heading text-[20px] font-semibold leading-tight text-slate-900">
                              {link.title}
                            </h3>
                            <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-slate-600">{link.description}</p>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="col-span-5">
                  <a
                    href={NAV_CONFIG.solutions.promo.href}
                    className="group relative block overflow-hidden rounded-[12px] shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                  >
                    <span className="pointer-events-none absolute right-4 top-4 z-10 inline-flex h-8 w-8 rotate-45 scale-90 items-center justify-center rounded-full bg-white text-slate-900 opacity-0 transition-all duration-200 ease-out group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:rotate-0 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                      <CornerLaunchIcon />
                    </span>
                    <img
                      src={NAV_CONFIG.solutions.promo.imageSrc}
                      alt={NAV_CONFIG.solutions.promo.title}
                      className="h-[235px] w-full object-cover"
                      style={{
                        WebkitMaskImage:
                          "radial-gradient(126% 126% at 50% 50%, #000 72%, rgba(0,0,0,0.55) 90%, transparent 100%)",
                        maskImage:
                          "radial-gradient(126% 126% at 50% 50%, #000 72%, rgba(0,0,0,0.55) 90%, transparent 100%)",
                      }}
                    />
                  </a>
                </aside>
              </div>
            )}

            {openMenu === "products" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6 pr-2">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-7">
                  {NAV_CONFIG.products.groups.map((group) => (
                    <section key={group.title}>
                      <div className="mb-2 flex items-center gap-2">
                        <a href={group.href} className="text-[15px] font-bold text-slate-900">
                          {group.title}
                        </a>
                        <a
                          href={group.href}
                          aria-label={`Open ${group.title}`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          <ExternalArrowIcon />
                        </a>
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            role="menuitem"
                            className="group flex items-center rounded-lg py-0.5 text-[15px] font-normal text-slate-700 transition-colors hover:text-slate-900 focus:outline-none"
                          >
                            <span className="inline-flex items-center gap-2">
                              <span className="whitespace-nowrap">{item.label}</span>
                              {item.isNew ? (
                                <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                                  New
                                </span>
                              ) : null}
                              <span className="-translate-x-1.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                                <InlineArrowIcon />
                              </span>
                            </span>
                          </a>
                        ))}
                      </div>
                    </section>
                  ))}
                  </div>
                </div>

                <aside className="col-span-6">
                  <div className="group relative overflow-hidden rounded-3xl bg-[#0b1220] p-7 text-white">
                    <span className="pointer-events-none absolute right-5 top-5 inline-flex h-8 w-8 rotate-45 scale-90 items-center justify-center rounded-full bg-white text-slate-900 opacity-0 transition-all duration-200 ease-out group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:rotate-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                      <CornerLaunchIcon />
                    </span>
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
                      <span
                        className="absolute right-0 top-[114px] h-[132px] w-[128px] origin-right scale-x-0 opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-within:scale-x-100 group-focus-within:opacity-100"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, rgba(16,58,255,0) 0 5px, rgba(16,58,255,0.95) 5px 9px, rgba(16,58,255,0) 9px 15px)",
                        }}
                      />
                      <span
                        className="absolute bottom-0 right-0 h-[56px] w-[52%] origin-right scale-x-0 opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-within:scale-x-100 group-focus-within:opacity-100"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, rgba(16,58,255,0) 0 5px, rgba(16,58,255,0.95) 5px 9px, rgba(16,58,255,0) 9px 15px)",
                        }}
                      />
                    </div>
                    <div className="relative z-10 max-w-[250px]">
                      <h3 className="font-heading text-[22px] font-semibold leading-tight">
                        {NAV_CONFIG.products.promo.title}
                      </h3>
                      <p className="mt-2.5 text-[14px] leading-relaxed text-slate-200">{NAV_CONFIG.products.promo.body}</p>
                    </div>
                    <div className="relative z-10 mt-6 overflow-hidden rounded-[24px]">
                      <div className="relative mr-5 overflow-hidden rounded-[20px]">
                        <img
                          src={NAV_CONFIG.products.promo.imageSrc}
                          alt="FANHub promo"
                          className="h-[200px] w-full object-cover"
                          style={{ objectPosition: "50% 50%" }}
                        />
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {openMenu === "learn" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-7 space-y-4 pr-2">
                  {NAV_CONFIG.learn.links.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      role="menuitem"
                      className="block rounded-2xl border border-gray-200 p-5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                    >
                      <h3 className="font-heading text-[18px] font-semibold text-slate-900">{link.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{link.description}</p>
                    </a>
                  ))}
                </div>
                <aside className="col-span-5">
                  <a
                    href={NAV_CONFIG.learn.promo.href}
                    className="block h-full overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-800 to-purple-950 p-7 text-white"
                  >
                    <h3 className="font-heading text-[26px] font-semibold leading-tight">
                      {NAV_CONFIG.learn.promo.title}
                    </h3>
                    <p className="mt-3 max-w-[35ch] text-[15px] leading-relaxed text-violet-100">
                      {NAV_CONFIG.learn.promo.body}
                    </p>
                    <div
                      className="mt-8 h-16 rounded-xl"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 10px, rgba(255,255,255,0.06) 10px 20px)",
                      }}
                    />
                  </a>
                </aside>
              </div>
            )}

          </div>
        </div>
      )}

      {isMobileOpen && (
        <div
          id="site-header-mobile-menu"
          className="absolute left-0 top-[96px] w-full border-t border-gray-200 bg-white px-6 py-5 shadow-xl lg:hidden"
        >
          <nav className="space-y-1" aria-label="Mobile navigation">
            {(["products", "solutions", "learn"] as MenuKey[]).map((section) => (
              <div key={section} className="border-b border-gray-100 py-1">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={mobileOpenSection === section}
                  aria-controls={`mobile-section-${section}`}
                  onClick={() => setMobileOpenSection((prev) => (prev === section ? null : section))}
                  className="flex w-full items-center justify-between py-3 text-left text-[16px] font-medium text-slate-900"
                >
                  <span>{NAV_CONFIG.topLabels[section]}</span>
                  <span aria-hidden="true" className="text-lg leading-none">
                    {mobileOpenSection === section ? "−" : "+"}
                  </span>
                </button>

                {mobileOpenSection === section && (
                  <div id={`mobile-section-${section}`} className="pb-3">
                    {section === "products" && (
                      <div className="space-y-3">
                        {NAV_CONFIG.products.groups.map((group) => (
                          <div key={group.title}>
                            <a href={group.href} className="block px-3 py-1 text-sm font-semibold text-slate-900">
                              {group.title}
                            </a>
                            <div className="mt-1 space-y-1">
                              {group.items.map((item) => (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <span>{item.label}</span>
                                  {item.isNew ? (
                                    <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                                      New
                                    </span>
                                  ) : null}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section === "solutions" && (
                      <div className="space-y-1">
                        {[...NAV_CONFIG.solutions.leftColumn, ...NAV_CONFIG.solutions.rightColumn].map((link) => (
                          <a
                            key={link.title}
                            href={link.href}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    )}

                    {section === "learn" && (
                      <div className="space-y-1">
                        {NAV_CONFIG.learn.links.map((link) => (
                          <a
                            key={link.title}
                            href={link.href}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            {link.title}
                          </a>
                        ))}
                        <a
                          href={NAV_CONFIG.learn.promo.href}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          SAOT – Semi-Automated Offside Technology
                        </a>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}

            <a
              href={NAV_CONFIG.topExternal.geniusiq}
              className="block border-b border-gray-100 py-4 text-[16px] font-medium text-slate-900"
            >
              {NAV_CONFIG.topLabels.geniusiq}
            </a>
            <a
              href={NAV_CONFIG.topExternal.customers}
              className="block border-b border-gray-100 py-4 text-[16px] font-medium text-slate-900"
            >
              {NAV_CONFIG.topLabels.customers}
            </a>

            <a
              href={NAV_CONFIG.cta.href}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-6 py-2.5 text-[16px] font-medium text-slate-900 transition-colors hover:bg-gray-200"
            >
              {NAV_CONFIG.cta.label}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
