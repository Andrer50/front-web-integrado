# MediConnect - Frontend Architecture Guide

This project follows a strict **Clean Architecture** paradigm separated into distinct layers of concern. To ensure modularity, scalability, and seamless state caching, all code must strictly adhere to the following architecture.

---

## 📂 Folder Structure

```bash
├── app/                  # Routing Layer (Next.js App Router Pages)
├── core/                 # Core Layer (Contracts & Backend Communication Actions)
│   └── [domain]/
│       ├── actions/      # Async server/client actions (apiClient HTTP calls)
│       └── interfaces/   # Pure TypeScript Interfaces (Request, Response, Filters)
├── modules/              # Modules Layer (React-specific integrations)
│   └── domain/
│       └── [domain]/
│           └── hooks/    # Custom React Query hooks wrapping core actions
├── presentation/         # Presentation Layer (Complex, domain-specific UI features)
│   └── dashboard/
│       └── [role]/       # Modular feature components grouped by role
└── components/           # UI Layer (Global reusable shadcn components & Layouts)
```

---

## 🏛️ Layer-by-Layer Guidelines

### 1. Core Layer (`/core`)
The Core represents pure domain logic and is agnostic to React components or hook libraries. It serves as the gateway to the REST API.

#### 📝 Interfaces (`/core/[domain]/interfaces/index.ts`)
Must contain only TypeScript types and interfaces. No runtime JS/TS code.
```typescript
import { Status } from "@/core/shared";

export interface DomainResponse {
  id: string;
  name: string;
  status: Status;
}

export interface DomainRequest {
  name: string;
}
```

#### ⚡ Actions (`/core/[domain]/actions/index.ts`)
Pure async functions utilizing the standard `apiClient` Axios instance. They should do simple, single-purpose REST requests.
```typescript
import { type ApiResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import { DomainRequest, DomainResponse } from "../interfaces";

export const createDomainAction = async (values: DomainRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<DomainResponse>>(
      "/api/v1/domains",
      values,
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

---

### 2. Modules Layer (`/modules`)
The modules layer binds Core actions to React framework primitives, using `@tanstack/react-query` to handle caching, background synchronization, and automatic re-fetching on mutations.

#### 🪝 Hooks (`/modules/domain/[domain]/hooks/`)
Implement query and mutation hooks here. 

> [!IMPORTANT]
> **NO usar archivos barrel `index.ts` para centralizar hooks**. Importa cada hook directamente desde su archivo específico (ej: `import { useCreateBranch } from "@/modules/domain/branch/hooks/useCreateBranch"`) para evitar dependencias circulares, mantener la claridad de las importaciones y optimizar la carga selectiva de bundles.

* **Query Hooks (`use[Domain]s.ts`)**:
  ```typescript
  import { useQuery } from "@tanstack/react-query";
  import { getDomainsAction } from "@/core/domain/actions";

  export const useDomains = () => {
    return useQuery({
      queryKey: ["domains"],
      queryFn: getDomainsAction,
      refetchOnWindowFocus: false,
    });
  };
  ```
* **Mutation Hooks (`useCreate[Domain].ts`)**:
  Side effects like displaying `sonner` toasts and query invalidation (`queryClient.invalidateQueries`) are handled exclusively here.
  ```typescript
  import { createDomainAction } from "@/core/domain/actions";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";

  export const useCreateDomain = ({ onSuccess } = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createDomainAction,
      onSuccess: () => {
        toast.success("Elemento registrado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["domains"] });
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.message || "Error al procesar la solicitud");
      },
    });
  };
  ```

---

### 3. Presentation Layer (`/presentation`) & Features
The presentation folder houses cohesive, role-based vertical slices of functionality (known as **Features**). 
Instead of cluttering `/components/ui` with highly specific domain components, domain components are packaged as features inside `presentation/dashboard/[role]/[feature-name]/`.

#### 🧩 What is a Feature?
A **Feature** is a self-contained folder that represents a domain-specific interactive component (such as a Creation Dialog, Detail Card, or Appointment Slider).
* **Location:** `/presentation/dashboard/[role]/[feature-name]/`
* **Structure:** Usually houses an `index.tsx` (the main component entrypoint) and any localized sub-components that are not shared globally.

Example:
```bash
presentation/dashboard/admin/specialties/
├── create-specialty-dialog/
│   └── index.tsx          # Self-contained creation modal
└── edit-specialty-dialog/
    └── index.tsx          # Self-contained details / editor modal
```

---

### 4. Routing Layer (`/app`)
Next.js page components (`page.tsx`) must remain **thin and declarative**.
* **Responsibility:** Load state from custom React hooks, manage search query inputs, render feature blocks inside responsive grid layouts, and handle routing parameters.
* Pages **should never** perform direct `axios`/`fetch` requests or manually call `queryClient` operations. They must always consume custom hooks from the `/modules` layer.
