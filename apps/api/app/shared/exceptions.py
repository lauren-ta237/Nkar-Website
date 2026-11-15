"""Shared domain exceptions for Nkar API."""


class DomainError(Exception):
    def __init__(self, message: str, code: str = "DOMAIN_ERROR"):
        self.message = message
        self.code = code
        super().__init__(message)


class ResourceNotFound(DomainError):
    def __init__(self, resource: str, identifier: str | int):
        super().__init__(f"{resource} with identifier '{identifier}' not found", code="NOT_FOUND")
