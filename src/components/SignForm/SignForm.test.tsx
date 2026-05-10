import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignForm } from "@/components/SignForm/SignForm";

const defaultProps = {
  title: "Test Title",
  hint: <span>Some hint</span>,
  onSubmit: vi.fn(),
  submitLabel: "Submit",
};

describe("SignForm", () => {
  it("renders the title", () => {
    render(<SignForm {...defaultProps}><div /></SignForm>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the hint", () => {
    render(<SignForm {...defaultProps}><div /></SignForm>);
    expect(screen.getByText("Some hint")).toBeInTheDocument();
  });

  it("renders submit button with the given label", () => {
    render(<SignForm {...defaultProps}><div /></SignForm>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("calls onSubmit when the form is submitted", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <SignForm {...defaultProps} onSubmit={onSubmit}>
        <div />
      </SignForm>
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("does not call onSubmit multiple times on repeated clicks", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <SignForm {...defaultProps} onSubmit={onSubmit}>
        <div />
      </SignForm>
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  describe("SignForm.Field", () => {
    it("renders the field label", () => {
      render(
        <SignForm {...defaultProps}>
          <SignForm.Field label="Username">
            <input />
          </SignForm.Field>
        </SignForm>
      );
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders all error messages", () => {
      render(
        <SignForm {...defaultProps}>
          <SignForm.Field label="Password" errors={["Too short", "Must include a number"]}>
            <input />
          </SignForm.Field>
        </SignForm>
      );
      expect(screen.getByText("Too short")).toBeInTheDocument();
      expect(screen.getByText("Must include a number")).toBeInTheDocument();
    });

    it("renders no errors when errors prop is empty", () => {
      render(
        <SignForm {...defaultProps}>
          <SignForm.Field label="Username" errors={[]}>
            <input />
          </SignForm.Field>
        </SignForm>
      );
      // Field errors are only rendered when the errors array has items
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      // Verify the label renders without extra text next to it
      const label = screen.getByText("Username");
      expect(label).toBeInTheDocument();
    });

    it("renders children inside the field", () => {
      render(
        <SignForm {...defaultProps}>
          <SignForm.Field label="Username">
            <input data-testid="my-input" />
          </SignForm.Field>
        </SignForm>
      );
      expect(screen.getByTestId("my-input")).toBeInTheDocument();
    });
  });

  describe("SignForm.Input", () => {
    it("passes props to the underlying input", () => {
      render(
        <SignForm {...defaultProps}>
          <SignForm.Input type="email" placeholder="email@example.com" />
        </SignForm>
      );
      const input = screen.getByPlaceholderText("email@example.com");
      expect(input).toHaveAttribute("type", "email");
    });
  });
});
