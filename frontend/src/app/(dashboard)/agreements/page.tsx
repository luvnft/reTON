"use client";

import { Button } from "@/components/ui/button";
import {
  useFetchAllAgreements,
  useFetchListings,
  useStake,
} from "@/hooks/useFetchBackend";
import { shortenAddress } from "@/lib/utils";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Copy } from "lucide-react";

export default function AgreementsPage() {
  const { address } = useWeb3ModalAccount();
  const { signPurchaseAgreement } = useFetchListings(false);
  const { handleApproveERC20, handleApproveERC721 } = useStake();
  const { isFetchingAgreements, allAgreements, isError } =
    useFetchAllAgreements();

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">Agreements</h1>

      <div className="my-2">
        <div className="bg-transparent md:bg-secondary/20 md:border px-0 md:px-6 rounded-xl">
          <p className="pb-8 md:py-6 text-primary font-bold border-b">
            [ List of all agreements by {shortenAddress(`${address}`)} ]
          </p>

          {isFetchingAgreements ? (
            <div className="py-4">
              <p>Loading agreements...</p>
            </div>
          ) : isError ? (
            <div className="py-4">
              <p>{isError}</p>
            </div>
          ) : allAgreements && allAgreements.length === 0 ? (
            <div className="py-4">
              <p>No agreements found, you need to initiate an agreement.</p>
            </div>
          ) : (
            allAgreements?.map((agr) => (
              <div
                className="py-4 md:py-6 flex flex-col gap-4 border-b last:border-b-0"
                key={agr.id}>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                      Estate ID:
                    </p>
                  </div>

                  <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-sm md:text-base text-muted-foreground md:text-foreground">
                    {agr.estateId}
                  </p>
                </div>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                      From:
                    </p>
                  </div>

                  <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-sm md:text-base text-muted-foreground md:text-foreground">
                    {shortenAddress(`${agr.initiator}`)}{" "}
                    <Copy className="w-4 h-4 cursor-pointer" />
                  </p>
                </div>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                      To:
                    </p>
                  </div>

                  <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-sm md:text-base text-muted-foreground md:text-foreground">
                    {shortenAddress(`${agr.buyer}`)}{" "}
                    <Copy className="w-4 h-4 cursor-pointer" />
                  </p>
                </div>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                      Number of Signers:
                    </p>
                  </div>

                  <p className="flex-1 font-bold flex items-center gap-3 text-sm md:text-base text-primary">
                    {agr.signersCount}
                  </p>
                </div>
                <div className="flex items-start flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                      All Signers:
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {agr.validSigners?.map((signer, _key) => (
                      <p
                        className="flex-1 font-bold flex items-center gap-3 text-sm md:text-base text-primary"
                        key={_key + 1}>
                        {signer}
                      </p>
                    ))}
                  </div>
                </div>
                {!agr.signed ? (
                  <Button
                    onClick={async () => {
                      await signPurchaseAgreement(
                        agr?.estateId.toString(),
                        agr.buyer,
                        agr?.listing.price.toString(),
                        (approval) =>
                          handleApproveERC20(
                            approval,
                            process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string
                          ),
                        (approval) =>
                          handleApproveERC721(
                            approval,
                            process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string
                          )
                      );
                    }}>
                    Sign
                  </Button>
                ) : null}

                {agr.executed ? <h2>Executed</h2> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
