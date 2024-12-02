"use client"; // Denotes that this module is a client-side module

// Import necessary dependencies
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Next.js navigation hooks
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs"; // Clerk authentication library
import { useContext } from "react"; // React hooks
import MyThemeContext from "@/store/ThemeContext"; // Custom context for theme

function LeftSidebar() {
  // Initialize necessary hooks
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const { userId } = useAuth(); // Get authenticated user's ID
  const { isDarkTheme } = useContext(MyThemeContext); // Get theme context

  return (
    <section className="no-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          // Determine if the link is active
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          // If the link is to the profile, append the user ID to the route
          if (link.route === "/profile") link.route = `${link.route}/${userId}`;

          return (
            // Render each sidebar link
            <Link
              href={link.route} // Set the link destination
              key={link.label} // Unique key for React rendering
              className={`leftsidebar_link ${isActive && "bg-red-800"}`} // Conditional class based on link activity
            >
              <Image
                src={isDarkTheme ? link.dimgURL : link.imgURL} // Use dark or light image based on theme
                alt={link.label} // Image alt text
                width={24}
                height={24}
              />

              <p className="text-black dark:text-light-1 max-lg:hidden">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        {/* Render sign out button only when user is signed in */}
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src={
                  isDarkTheme ? "/assets/logout-w.svg" : "/assets/logout.svg" // Use dark or light logout icon based on theme
                }
                alt="logout"
                width={24}
                height={24}
              />

              <p className="text-black dark:text-light-2 max-lg:hidden">
                Logout
              </p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}

export default LeftSidebar;
