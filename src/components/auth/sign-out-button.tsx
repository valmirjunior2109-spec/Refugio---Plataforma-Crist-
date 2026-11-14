import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { buttonClasses } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className={buttonClasses("ghost", "sm")}>
        <LogOut className="size-4" aria-hidden />
        Sair da conta
      </button>
    </form>
  );
}
