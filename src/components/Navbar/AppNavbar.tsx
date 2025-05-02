"use client";
import ThemeToggle from "@/components/ThemeToggle";
import ColourfulText from "@/components/ui/colourful-text";
import { useWebLN } from "@/webln/provider";
import { DownOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Space, theme } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store"; 
import { addWallet } from "@/redux/slice/WalletSlice"; 
import { useAppDispatch, useAppSelector } from "@/redux/hook";

const { useToken } = theme;

export default function FloatingDockDemo() {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const wallet = useAppSelector((state: RootState) => state.wallet);

  const { getInfo, enable, disconnect } = useWebLN();

  const handleGetInfo = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await enable();
      const info = await getInfo();
      console.log("Wallet Info: ", info);
      dispatch(addWallet(info));
    } catch (error) {
      console.error("Error fetching wallet info: ", error);
      toast.error("Error fetching wallet info");
    } finally {
      setLoading(false);
    }
  };

  const dropdownItems = [
    {
      key: "version",
      label: `Version: ${wallet?.version || "N/A"}`,
    },
    {
      key: "pubkey",
      label: `Node Pubkey: ${wallet?.node?.pubkey || "N/A"}`,
    },
    {
      key: "methods",
      label: `Methods: ${wallet?.methods?.join(", ") || "N/A"}`,
    },
    {
      key: "supports",
      label: `Supports: ${wallet?.supports?.join(", ") || "N/A"}`,
    },
  ];

  return (
    <div className="flex justify-between items-center mt-5">
      <div className="text-3xl font-bold z-2 font-sans">
        <ColourfulText text="payBeam" />
      </div>
      <div className="flex space-x-4 justify-between">
        <ThemeToggle />
        <Dropdown
          menu={{ items: dropdownItems }}
          dropdownRender={(menu) => (
            <div
              style={{
                backgroundColor: token.colorBgElevated,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowSecondary,
              }}
            >
              {React.cloneElement(
                menu as React.ReactElement<{ style: React.CSSProperties }>,
                { style: { boxShadow: "none" } }
              )}
              <Divider style={{ margin: 0 }} />
              <Space style={{ padding: 8 }}>
                <Button
                  loading={loading}
                  disabled={loading}
                  onClick={(e) => handleGetInfo(e)}
                  type="primary"
                >
                  Refresh
                </Button>
                 <Button
                  onClick={(e) => disconnect()}
                 
                >
                  Disconnect
                </Button>
              </Space>
            </div>
          )}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Wallet Info
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
