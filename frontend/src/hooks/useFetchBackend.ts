"use client";

import { getDaoContract, getDiamondContract, getProvider } from "@/connections";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RENDER_ENDPOINT = process.env.NEXT_PUBLIC_RENDER_ENDPOINT;

export const useFetchListings = () => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  async function fetchData() {
    setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      contract.on("CreatedListing", (owner, tokenId, price) => {
        let data = {
          owner,
          price,
          tokenId: tokenId.toNumber(),
        };

        console.log(data);
        fetchData();
      });
      const tx = await contract.getListings();
      setListings(tx);
    } catch (error: any) {
      console.log(error);

      if (error.reason === "rejected") {
        toast("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        console.log(error);
        toast(error.code, {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, listings };
};

export const useFetchUnApprovedListings = () => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  async function fetchData() {
    setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDaoContract(signer);

    try {
      const tx = await contract.getUnApprovedAssigns("Kaduna State");
      setListings(tx);
    } catch (error: any) {
      console.log(error);

      if (error.reason === "rejected") {
        toast("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        console.log(error);
        toast(error.code, {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, listings };
};

export const useApproveListing = (id: string) => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  async function fetchData() {
    setIsLoading(true);

    try {
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner(
        process.env.NEXT_PUBLIC_ADMIN_ADDRESS
      );
      const contract = getDaoContract(signer);

      const tx = await contract.approveListing(id);
      const receipt = await tx.wait();

      if (receipt.status) {
        console.log(tx);

        setIsApproved(true);
        return toast.success("Listing approved successfully 🎉");
      } else {
        return toast.error("Failed to send transaction");
      }
    } catch (error) {
      console.error(error); // Log any errors
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, isApproved };
};
