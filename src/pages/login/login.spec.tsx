import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import Login from "./login";

describe("Login Page", () => {
    it("should render the login form", () => {
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <Login />
            </QueryClientProvider>
        );

        // getBy -> throws an error
        // queryBy -> null
        // findBy -> Async

        expect(screen.getByText("Sign in")).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
        expect(screen.getByText('Forgot password')).toBeInTheDocument();
    });
});