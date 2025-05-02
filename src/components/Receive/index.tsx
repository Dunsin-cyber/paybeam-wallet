"use client";
import { useClient } from "@/context";
import { useRouter } from "@/hooks/useRouterWithProgress";
import { useWebLN } from "@/webln/provider";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, QRCode, Typography, theme, Result } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import Converter from "./Converter";


const { Paragraph, Text } = Typography;

function Recieve() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [generated, setGenerated] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const { invoiceSats, setCreatedInvoice } = useClient();
  const { enable,makeInvoice, balance } = useWebLN();

  const handleCreateInvoice = async () => {
    try {
      if (!invoiceSats) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (!description) {
        toast.error("Please enter a description");
        return;
      }
      setLoading(true);
    // Enable webLn
     await enable();
     const invoice =  await makeInvoice(invoiceSats, description);
      setCreatedInvoice(invoice);
        setGenerated(true);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(error.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 gap-5 w-full max-w-md md:max-w-3xl mx-auto">
      <div className="flex items-center justify-between w-full my-4">
        <ArrowLeftOutlined onClick={() => router("/back")} />
        <h1 className="text-2xl font-bold text-center">Generate Invoice</h1>
        <div />
      </div>
      {!generated ? (
        <div className="flex flex-col items-center w-full gap-5">
          <div className="flex flex-col font-bold space-y-1 w-full">
            <Converter />
          </div>
          <div className="flex flex-col font-bold space-y-1 w-full">
            <p>Description</p>
            <Input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Description"
              className="w-full"
            />
          </div>
          <Button
            onClick={handleCreateInvoice}
            disabled={loading}
            loading={loading}
            type="primary"
            className="mt-8 w-full"
          >
            Continue
          </Button>
        </div>
      ) : (
        <SuccessScreen />
      )}
    </div>
  );
}

export default Recieve;

const { useToken } = theme;

function SuccessScreen() {
  const { token } = useToken();
    const { createdInvoice } = useClient();
    const [paid, setPaid] = useState(false)


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(createdInvoice);
      toast.success("Link copied to clipboard!");

      setTimeout(() => {
        setPaid(true)
      },10000)
    } catch (err) {
      toast.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
     {paid ? (

       <Result
            status="success"
            title="Successfully Received Payment"
            subTitle={` received XLM `}
          />
          ): (
            <div className="flex flex-col justify-center items-center gap-4">
            
      <QRCode
        size={250}
        value={createdInvoice}
        color={token.colorSuccessText}
      />
      <Button type="primary" size="large" key="console" onClick={handleCopy}>
        Copy to Clipboard
      </Button>
      <Text>waiting for payment...</Text>
      </div>
      )}
    </div>
  );
}
