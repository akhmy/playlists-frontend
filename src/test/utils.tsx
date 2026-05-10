import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types/user";
import { vi } from "vitest";

interface TestRenderOptions extends Omit<RenderOptions, "wrapper"> {
  user?: User | null;
  initialEntries?: string[];
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { user = null, initialEntries = ["/"], ...renderOptions }: TestRenderOptions = {}
) => {
  const setUser = vi.fn();
  const result = render(
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <AuthContext.Provider value={{ user, setUser }}>
          {ui}
        </AuthContext.Provider>
      </MemoryRouter>
    </HelmetProvider>,
    renderOptions
  );
  return { ...result, setUser };
};
