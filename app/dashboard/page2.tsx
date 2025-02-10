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

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);
    const [copied, setCopied] = useState(false);

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
<div className="min-h-screen bg-background">
            {/* Navigation Bar */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
                    <div className="flex items-center gap-2 font-semibold">
                        <Flag className="h-5 w-5 text-destructive" />
                        RedFlag
                    </div>

                    <nav className="hidden md:flex flex-1 items-center gap-4 md:gap-6">
                        <form className="flex-1 max-w-xl" onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search flagged people or companies"
                                    className="pl-9 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                        <Button variant="ghost" size="sm"><Home className="h-4 w-4 mr-2" /> Home</Button>
                        <Button variant="ghost" size="sm"><Flag className="h-4 w-4 mr-2" /> My Flags</Button>
                    </nav>
                </div>
            </header>

            <div className="container py-6 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="md:col-span-3">
                        <Card className="p-6">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" size="lg">
                                        <Flag className="mr-2 h-5 w-5" /> Flag Someone
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Flag Someone</DialogTitle>
                                        <DialogDescription>
                                            Search for a profile or paste a LinkedIn URL to flag someone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <Input placeholder="Search for a profile" className="w-full" />
                                        <div className="relative flex justify-center">
                                            <span className="w-full border-t" />
                                            <span className="bg-background px-2 text-muted-foreground text-xs uppercase">or</span>
                                            <span className="w-full border-t" />
                                        </div>
                                        <Input placeholder="Paste LinkedIn profile URL" className="w-full" />
                                        <Button className="w-full">Continue</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-6">
                        <Tabs defaultValue="people" className="w-full">
                            <TabsList className="w-full py-2 flex">
                                <TabsTrigger value="people" className="flex-1">People</TabsTrigger>
                                <TabsTrigger value="companies" className="flex-1">Companies</TabsTrigger>
                            </TabsList>
                            <TabsContent value="people" className="space-y-4 mt-6">
                                {peopleData.map((person, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div>
                                                <h3 className="font-semibold">{person.name}</h3>
                                                <p className="text-sm text-muted-foreground">{person.title}</p>
                                            </div>
                                            <div className="text-right mt-2 md:mt-0">
                                                <div className="font-semibold text-destructive">🚩 {person.flags} Flags</div>
                                                <div className="text-sm text-muted-foreground">👥 {person.flaggers} Flaggers</div>
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
                                                <h3 className="font-semibold">{company.name}</h3>
                                                <p className="text-sm text-muted-foreground">{company.industry}</p>
                                            </div>
                                            <div className="text-right mt-2 md:mt-0">
                                                <div className="font-semibold text-destructive">🚩 {company.flags} Flags</div>
                                                <div className="text-sm text-muted-foreground">👥 {company.flaggers} Flaggers</div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar */}
                    <div className="md:col-span-3">
                        <Card className="p-6 mb-6">
                            <h3 className="font-semibold mb-4">Your Wallet</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-2xl font-bold">1,234 RFC</div>
                                    <div className="text-sm text-muted-foreground">≈ $123.40 USD</div>
                                </div>
                                <Button className="w-full">
                                    <Coins className="mr-2 h-4 w-4" /> Get More Tokens
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
