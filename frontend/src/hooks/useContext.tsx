import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

interface Config {
  idAccount: string;
  thoiHanTaiLieu: number;
  ngayBaoHetHan: number;
  ngayBaoDangKiem: number;
}

interface ConfigContextType {
  config: Config | null;
  setConfig: Dispatch<SetStateAction<Config | null>>;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined,
);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config | null>(null);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
