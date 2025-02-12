"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Flag,
    Coins,
    LogOut,
    Settings,
    User,
    Home,
    Wallet,
    Clipboard,
    ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { web3auth } from "@/lib/web3auth";
import { useRouter } from "next/navigation";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Connection, PublicKey } from "@solana/web3.js";
import { companiesData, peopleData } from "@/lib/data";
import Image from "next/image";
import logo from "../images/logo.png";

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);
    const [copied, setCopied] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(1234);
    const [usdEquivalent, setUsdEquivalent] = useState(123.4);

    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowLinkedIn(true);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(publicKey!);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getInfo = async () => {
        if (web3auth.provider) {
            const solanaWallet = new SolanaWallet(web3auth.provider);

            // Get user's Solana public address
            const accounts = await solanaWallet.requestAccounts();

            const connectionConfig = await solanaWallet.request({
                method: "solana_provider_config",
                params: [],
            });

            // @ts-ignore
            const connection = new Connection(connectionConfig.rpcTarget);

            // Fetch the balance for the specified public key
            const balance = await connection.getBalance(
                new PublicKey(accounts[0])
            );

            setPublicKey(accounts[0]);
            setBalance(balance);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                console.log("Web3Auth State:", web3auth); // Debugging line

                if (!web3auth.provider) {
                    router.push("/");
                } else {
                    await getInfo();
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const logout = async () => {
        await web3auth.logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center">
            {/* Navigation Bar */}
            <header className="border-b flex w-full justify-end bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex justify-end h-16 items-center gap-4 px-4 md:px-12">
                    <nav className="hidden md:flex items-center gap-4 md:gap-6">
                        <Button variant="ghost" size="sm">
                            <Wallet className="h-4 w-4 mr-2" /> Token Balance
                        </Button>
                        <Button variant="ghost" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" /> Buy RFC
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    onClick={async () => await getInfo()}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <User className="h-4 w-4 mr-2" /> My Account
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 bg-white shadow-lg rounded-lg p-2"
                            >
                                <DropdownMenuItem className="flex items-center justify-between gap-2 p-2 border-b">
                                    <span className="truncate max-w-[120px]">
                                        {publicKey}
                                    </span>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-gray-500 hover:text-gray-800"
                                    >
                                        <Clipboard className="h-4 w-4" />
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-2 font-semibold text-gray-700">
                                    {balance} SOL
                                </DropdownMenuItem>
                                {copied && (
                                    <span className="text-xs text-green-500 text-center">
                                        Copied!
                                    </span>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />{" "}
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />{" "}
                                        Logout
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </header>

            <div className="flex items-center gap-2 ml-4 font-semibold my-8">
                <Image alt="" src={logo} width={70} height={70} />
            </div>

            <form className="flex-1 w-80" onSubmit={handleSearch}>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for flagged people or companies"
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </form>

            <form className="flex-1 w-80 mt-6" onSubmit={handleSearch}>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Paste LinkedIn Profile to Flag them"
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </form>

            <div className="container py-6 px-4 md:px-6">
                <Tabs defaultValue="people" className="w-full">
                    <TabsList className="w-full py-2 flex">
                        <TabsTrigger value="people" className="flex-1">
                            People
                        </TabsTrigger>
                        <TabsTrigger value="companies" className="flex-1">
                            Companies
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="people" className="space-y-4 mt-6">
                        {peopleData.map((person, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            {person.name}
                                        </h3>
                                        <p
                                            className="text-blue-600 text-sm"
                                        >
                                            {person.title}
                                        </p>
                                    </div>
                                    <div className="text-right mt-2 md:mt-0">
                                        <div className="font-semibold text-destructive">
                                            🚩 {person.flags} Flags
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            👥 {person.flaggers} Flaggers
                                        </div>
                                        {/* <div className="text-sm text-muted-foreground">
                                            {person.categories
                                                .slice(0, 3)
                                                .map(
                                                    (cat) => `${cat.name} (${cat.count})`
                                                )
                                                .join(", ")}
                                        </div> */}
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                alert(
                                                    `Viewing profile of ${person.name}`
                                                )
                                            }
                                            className="mt-2"
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                    <TabsContent value="companies" className="space-y-4 mt-6">
                        {companiesData.map((company, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            {company.name}
                                        </h3>
                                        <p
                                            className="text-blue-600 text-sm"
                                        >
                                            {company.industry}
                                        </p>
                                    </div>
                                    <div className="text-right mt-2 md:mt-0">
                                        <div className="font-semibold text-destructive">
                                            🚩 {company.flags} Flags
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            👥 {company.flaggers} Flaggers
                                        </div>
                                        {/* <div className="text-sm text-muted-foreground">
                                            {company.categories
                                                .slice(0, 3)
                                                .map(
                                                    (cat) => `${cat.name} (${cat.count})`
                                                )
                                                .join(", ")}
                                        </div> */}
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                alert(
                                                    `Viewing profile of ${company.name}`
                                                )
                                            }
                                            className="mt-2"
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>

            <footer className="border-t mt-6 py-4 text-center text-sm">
                <div className="space-x-4">
                    <a
                        href="/terms"
                        className="text-muted-foreground hover:underline"
                    >
                        Terms & Conditions
                    </a>
                    <a
                        href="/privacy"
                        className="text-muted-foreground hover:underline"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/contact"
                        className="text-muted-foreground hover:underline"
                    >
                        Contact Us
                    </a>
                    <a
                        href="/how-tokens-work"
                        className="text-muted-foreground hover:underline"
                    >
                        How Tokens Work
                    </a>
                </div>
            </footer>
        </div>
    );
}
